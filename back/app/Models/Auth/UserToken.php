<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;

class UserToken extends Model
{
    protected $table = 'user_token';
    protected $primaryKey = 'token_id';
    public $timestamps = false;
    protected $fillable = [
        'user_id', 'user_email', 'token', 'created_at', 'end_date'
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'end_date' => 'datetime'
    ];
}