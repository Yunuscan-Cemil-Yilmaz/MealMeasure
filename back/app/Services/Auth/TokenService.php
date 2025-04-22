<?php

namespace App\Services\Auth;

use App\Models\Auth\UserToken;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

use function Illuminate\Log\log;

class TokenService
{
    public function __construct() {  }

    private function checkUserExists($userId, $userEmail): bool{
        $userExists = DB::selectOne(
            "SELECT user_id FROM users WHERE user_id = :userId  AND user_email = :user_email LIMIT 1", 
            ['userId' => $userId, 'user_email' => $userEmail]
        );
        if($userExists){ return true;}
        else { return false; }
    }

    private function createToken($userId, $userEmail) {
        $checkExists = $this->checkUserExists($userId, $userEmail);
        if($checkExists){
            $token = Str::random(64);
            try{
                $this->deleteTokenByUser($userId, $userEmail);
                UserToken::create([
                    'user_id' => $userId,
                    'user_email' => $userEmail,
                    'token' => $token
                ]);

                return $token;
            }catch(QueryException $e){
                return false;
            }
        }else { return false; }
    }

    private function createLongTermToken($userId, $userEmail){
        $checkExists = $this->checkUserExists($userId, $userEmail);
        if($checkExists){
            $addHourAmount = config('app.hour_amount_for_long_term_token');
            $token = Str::random(64);
            try{
                $this->deleteTokenByUser($userId, $userEmail);
                UserToken::create([
                    'user_id' => $userId,
                    'user_email' => $userEmail,
                    'token' => $token,
                    'end_date' => now()->addHour($addHourAmount),
                ]);

                return $token;
            }catch(QueryException $e){
                return false;
            }
        }else { 
            return false;
        }
    }

    private function validateToken($token, $userId, $userEmail): bool{
        try{
            $tokenExists = DB::selectOne(
                "SELECT *
                FROM user_token
                WHERE user_id = :userId
                AND user_email = :userEmail
                AND token = :token
                AND created_at <= NOW()
                AND end_date > NOW()
                LIMIT 1",
                [
                    'userId' => $userId,
                    'userEmail' => $userEmail,
                    'token' => $token
                ]
            );
    
            if (!$tokenExists) {
                $timeoutToken = DB::selectOne(
                    "SELECT *
                    FROM user_token
                    WHERE user_id = :userId
                    AND user_email = :userEmail
                    AND token = :token
                    LIMIT 1",
                    [
                        'userId' => $userId,
                        'userEmail' => $userEmail,
                        'token' => $token
                    ]
                );

                if(!$timeoutToken){
                    return false;
                }

                DB::delete(
                    "DELETE FROM user_token
                    WHERE token = :token 
                    AND user_id = :userId
                    AND user_email = :userEmail",
                    [
                        'userId' => $timeoutToken->user_id,
                        'userEmail' => $timeoutToken->user_email,
                        'token' => $timeoutToken->token
                    ]
                );
                return false;
            }
    
            if($tokenExists->end_date > now()){
                return true;
            }else { 
                DB::delete(
                    "DELETE FROM user_token
                    WHERE token = :token 
                    AND user_id = :userId
                    AND user_email = :userEmail",
                    [
                        'userId' => $tokenExists->user_id,
                        'userEmail' => $tokenExists->user_email,
                        'token' => $tokenExists->token
                    ]
                );
                return false;
            }
        } catch(QueryException $e){
            return false;
        }
    }

    private function validateAdminToken($token, $userId, $userEmail): bool{
        $valideToken = $this->validateToken($token, $userId, $userEmail);
        if(!$valideToken){
            return false;
        }
        $isAdmin = DB::selectOne("SELECT is_admin FROM users WHERE user_id = :userId LIMIT 1",[ 'userId' => $userId ]);
        if(!$isAdmin){
            return false;
        }

        return true;
    }

    public function createUserToken($userId, $userEmail, bool $longTerm){
        try{
            if($longTerm){
                $token = $this->createLongTermToken($userId, $userEmail);
                if($token){
                    return $token;
                }else{
                    return false;
                }
            }else {
                $token = $this->createToken($userId, $userEmail);
                if($token){
                    return $token;
                }else{
                    return false;
                }
            }
        }catch(QueryException $e){
            return false;
        }
    }

    public function checkUserToken($token, $userId, $userEmail){
        $checkToken = $this->validateToken($token, $userId, $userEmail);
        if($checkToken){
            return true;
        }else {
            return false;
        }
    }

    public function checkAdminToken($token, $userId, $userEmail){
        $checkToken = $this->validateAdminToken($token, $userId, $userEmail);
        if($checkToken){
            return true;
        }else {
            return false;
        }
    }

    private function deleteTokenByUser($userId, $userEmail): void { 
        UserToken::where('user_id', $userId)
        ->where('user_email', $userEmail)
        ->delete();
    }

    public function deleteTokenByToken($token): bool{
        try{
            return UserToken::where('token', $token)->delete() > 0;
        }catch(QueryException $e){
            return false;
        }
    }

}
