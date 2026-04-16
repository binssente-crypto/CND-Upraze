<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiConversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'messages',
        'model_used',
        'token_used',
    ];

    protected $casts = [
        'messages' => 'array',
        'token_used' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
