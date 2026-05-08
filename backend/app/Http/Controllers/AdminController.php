<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getUsers(Request $request)
    {
        try {
            $currentUser = $request->user();
            if (!in_array($currentUser->role, ['admin', 'superadmin'])) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $totalRevenue = 0;
            try {
                $totalRevenue = \App\Models\Invoice::where('status', 'paid')->sum('amount');
            } catch (\Exception $e) {}

            $totalUsers = User::where('role', '!=', 'superadmin')->count();

            // Superadmin sees everyone (except themselves), Admin sees only 'user' role
            $query = User::where('id', '!=', $currentUser->id);
            if ($currentUser->role !== 'superadmin') {
                $query->where('role', 'user');
            } else {
                $query->where('role', '!=', 'superadmin'); // Don't show other superadmins if any
            }

            $users = $query->with(['subscriptions' => function ($q) {
                $q->latest();
            }])
            ->get()
            ->map(function (User $user) {
                $latestSubscription = $user->subscriptions->first();
                return [
                    'id' => $user->id,
                    'name' => $user->nickname ?: $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'plan' => $latestSubscription ? $latestSubscription->plan_name : 'No Plan',
                    'status' => $latestSubscription ? ucfirst($latestSubscription->status) : 'Inactive',
                    'account_status' => $user->status ?: 'active',
                    'joined' => $user->created_at->format('M d, Y'),
                ];
            });

            return response()->json([
                'stats' => [
                    'total_revenue' => number_format($totalRevenue, 2),
                    'active_clients' => $totalUsers,
                ],
                'users' => $users,
                'current_user_role' => $currentUser->role
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function updateUserRole(Request $request, User $user)
    {
        if ($request->user()->role !== 'superadmin') {
            return response()->json(['message' => 'Only Superadmins can manage roles'], 403);
        }

        $validated = $request->validate([
            'role' => 'required|in:admin,user'
        ]);

        $user->update(['role' => $validated['role']]);

        return response()->json(['message' => "User role updated to {$validated['role']}"]);
    }

    public function updateUserStatus(Request $request, User $user)
    {
        if (!in_array($request->user()->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:active,suspended'
        ]);

        $user->update(['status' => $validated['status']]);

        return response()->json(['message' => "User account is now {$validated['status']}"]);
    }
    public function getOverview(Request $request)
    {
        try {
            $currentUser = $request->user();
            if (!in_array($currentUser->role, ['admin', 'superadmin'])) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $totalRevenue = \App\Models\Invoice::where('status', 'paid')->sum('amount');
            $totalUsers = User::where('role', 'user')->count();
            $totalAdmins = User::where('role', 'admin')->count();

            // Support Stats
            $openTickets = \App\Models\SupportThread::where('status', 'open')->count();
            $myTickets = \App\Models\SupportThread::where('assigned_admin_id', $currentUser->id)->where('status', '!=', 'closed')->count();

            // Sales Chart Data (Last 6 months)
            // Using TO_CHAR for Postgres
            $salesData = \App\Models\Invoice::where('status', 'paid')
                ->where('created_at', '>=', now()->subMonths(6))
                ->selectRaw("TO_CHAR(created_at, 'Mon') as month, sum(amount) as total, MAX(created_at) as sort_date")
                ->groupBy('month')
                ->orderBy('sort_date')
                ->get()
                ->map(function($item) {
                    return [
                        'month' => $item->month,
                        'total' => (float)$item->total
                    ];
                });

            // Plan Distribution (Pie Chart Data)
            $planDistribution = \App\Models\Subscription::where('stripe_status', 'active')
                ->orWhere('stripe_status', 'trialing')
                ->join('plans', 'plans.id', '=', 'subscriptions.plan_id')
                ->selectRaw('plans.name as name, count(*) as value')
                ->groupBy('plans.name')
                ->get();

            return response()->json([
                'stats' => [
                    'total_revenue' => $totalRevenue,
                    'total_users' => $totalUsers,
                    'total_admins' => $totalAdmins,
                    'open_tickets' => $openTickets,
                    'my_tickets' => $myTickets,
                ],
                'sales_chart' => $salesData,
                'plan_distribution' => $planDistribution
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
