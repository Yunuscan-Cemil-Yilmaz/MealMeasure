<?php

namespace App\Services\Auth;

// models
use App\Models\Auth\User;
use App\Models\Auth\UserToken;
// services
use App\Services\Auth\TokenService;
use App\Services\Auth\PasswordService;
use App\Services\Auth\ValidateAuthDatas;
use App\Services\User\UserService;
use Exception;
// laravel utilities
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;

use function PHPUnit\Framework\isEmpty;

class LoginService extends UserService
{
    protected $passwordService;
    protected $userModel;
    protected $validate;
    protected $tokenService;

    public function __construct(
        User $userModel,
        PasswordService $passwordService,
        ValidateAuthDatas $validate,
        TokenService $tokenService
    ) {
        $this->userModel = $userModel;
        $this->passwordService = $passwordService;
        $this->validate = $validate;
        $this->tokenService = $tokenService;
    }

    private function loginProcess($email, $password, bool $longTerm=false){
        try{
            $user = $this->userModel->where('user_email', $email)->first();
            if(!$user){
                return response()->json([
                    'status' => 400,
                    'message' => 'user not found',
                ], 400);
            }
            $checkPassword = $this->passwordService->checkHash($password, $user->getUserPassword());
            if($checkPassword){
                $token = $this->tokenService->createUserToken($user->user_id, $user->user_email, $longTerm);
                return response()->json([
                    'user' => $user,
                    'token' => $token,
                ], 200);
            }else {
                return response()->json([
                    'status' => 401,
                    'message' => 'invalid credentials',
                ], 401);
            }
        }catch(QueryException $e){
            return response()->json([
                'status' => 500,
                'message' => 'internal server error',
            ], 500);
        }
    }

    public function login($email, $password, $longTerm=false){
        try{
            $this->validate->validateEmailForExists($email);
            $this->validate->validatePassword($password);

            if($longTerm) $result = $this->loginProcess($email, $password, true);
            else $result = $this->loginProcess($email, $password);
            return $result;
        }catch (ValidationException $e){
            return response()->json([
                'status' => 422,
                'message' => 'validation error',
                'errors' => $e->errors()
            ]);
        }
    }


    // autologin
    private function autoLoginProcess($userId, $email, $token){
        $checkToken = $this->tokenService->checkUserToken($token, $userId, $email);
        if($checkToken){
            $user = $this->userModel->where('user_id', $userId)->first();
            if(!$user){
                return response()->json([
                    'status' => 400,
                    'message' => 'user not found',
                ], 400);
            }
            return response()->json([
                'user' => $user,
                'token' => $token,
            ], 200);
        }else {
            return null;
        }
    }

    public function autoLogin($userId, $email, $token){
        try{
            $this->validate->validateEmailForExists($email);
        }catch (ValidationException $e){
            return response()->json([
                'status' => 422,
                'message' => 'validation error',
                'errors' => $e->errors()
            ]);
        }
        if(empty($userId) || empty($email) || empty($token)){
            return response()->json([
                'status' => 422,
                'message' => 'validation error',
            ], 422);
        }
        try{
            $result = $this->autoLoginProcess($userId, $email, $token);
            return $result;
        }catch (QueryException $e){
            return response()->json([
                'status' => 500,
                'message' => 'internal server error',
            ], 500);
        }
    }

    // logout
    private function logoutProcess($userId){
        UserToken::where('user_id', $userId)->delete();
    }

    public function logout($userId){
        $checkExists = $this->isUserExistsById($userId);
        if($checkExists){
            try{
                $this->logoutProcess($userId);
                return true;
            }catch(Exception $e){
                return false;
            }
        }else {
            return false;
        }
    }
}
