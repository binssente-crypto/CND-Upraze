<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportThread extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subject',
        'category',
        'status',
        'assigned_admin_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedAdmin()
    {
        return $this->belongsTo(User::class, 'assigned_admin_id');
    }

    public function messages()
    {
        return $this->hasMany(SupportMessage::class, 'thread_id');
    }

    public function latestMessage()
    {
        return $this->hasOne(SupportMessage::class, 'thread_id')->latestOfMany();
    }

    public function unreadCount()
    {
        return $this->messages()->where('is_read', false);
    }
}
