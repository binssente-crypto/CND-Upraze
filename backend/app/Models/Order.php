<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'offer_id',
        'plan_name',
        'company_name',
        'company_logo',
        'short_description',
        'design_preference',
        'feature_options',
        'status',
        'xendit_invoice_id',
        'payment_url',
    ];

    // removed array cast

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }
}
