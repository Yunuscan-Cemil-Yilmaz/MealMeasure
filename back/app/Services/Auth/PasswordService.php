<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Hash;

class PasswordService
{
    /**
     *  Hash the given password
     *  @param string $password
     *  @return string
     */
    public function hashPassword($psw): string{
        return Hash::make($psw);
    }

    /**
     * Verify if the given password matches the hashed password.
     *
     * @param string $password
     * @param string $hashedPassword
     * @return bool
     */
    public function checkHash(string $psw, string $hash): bool
    {
        return Hash::check($psw, $hash);
    }
}
