<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = [
        'name',
        'price',
        'interval',
        'features',
        'status',
        'type',
    ];

    protected $casts = [
        'features' => 'array',
    ];
}
