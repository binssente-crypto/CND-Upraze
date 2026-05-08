<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ForecastingController extends Controller
{
    /**
     * Return static demo forecasting data.
     */
    public function index(Request $request)
    {
        $labels = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'];
        $actual = [142, 156, 171, null, null, null];
        $predicted = [138, 152, 168, 185, 203, 224];

        return response()->json([
            'status' => 'completed',
            'result_json' => [
                'labels' => $labels,
                'actual' => $actual,
                'predicted' => $predicted,
                'accuracy' => '96.4%',
                'insight' => 'The dataset reveals a consistent upward trajectory in unit sales over the observed period, with an average monthly growth rate of approximately 9.7%. Our model projects this trend to continue through Q2 2026, with predicted peak demand reaching 224 units by June.',
                'growth_trend' => '+28.4%',
                'max_peak' => '224 Units',
                'outlier_risk' => 'Low',
                'financials' => [
                    'predicted_revenue' => '₱100,800.00',
                    'predicted_profit' => '₱62,720.00',
                    'margin' => '42%',
                ],
            ],
        ]);
    }
}
