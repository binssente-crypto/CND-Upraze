<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;

class NotifyExpiringSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:notify-expiring';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notify users 1 week before their subscription plan ends';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find subscriptions ending exactly 7 days from today
        $targetDateStart = Carbon::today()->addDays(7)->startOfDay();
        $targetDateEnd = Carbon::today()->addDays(7)->endOfDay();

        $expiringSubscriptions = Subscription::whereBetween('ends_at', [$targetDateStart, $targetDateEnd])
            ->with('user', 'plan')
            ->get();

        $count = 0;

        foreach ($expiringSubscriptions as $subscription) {
            $user = $subscription->user;
            $plan = $subscription->plan;

            if ($user && $user->email && $plan) {
                // Send email notification (you can create a proper Mailable class for this)
                // Using raw email for simplicity in this example
                Mail::raw("Hi {$user->name},\n\nThis is a reminder that your {$plan->name} subscription is set to expire on {$subscription->ends_at->format('M d, Y')}.\n\nPlease renew your plan in the billing section to continue using our services.\n\nThank you,\nCND Upraze Team", function ($message) use ($user, $plan) {
                    $message->to($user->email)
                            ->subject("Action Required: Your {$plan->name} plan expires in 1 week");
                });
                
                $count++;
            }
        }

        $this->info("Sent expiration notifications to {$count} users.");
    }
}
