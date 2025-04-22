<?php

namespace App\Services\User;

use App\Models\Auth\User;

class UserService
{
    public function __construct() { }

    protected function isUserExistsById($userId): bool {
        $user = User::where('user_id', $userId)->first();
        if ($user) {
            return true;
        }
        return false;
    }
}
