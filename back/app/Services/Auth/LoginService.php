<?php

namespace App\Services\Auth;

// models
use App\Models\Auth\User;

// services
use App\Services\Auth\TokenService;
use App\Services\Auth\PasswordService;
use App\Services\Auth\ValidateAuthDatas;

// laravel utilities
use Illuminate\Validation\ValidationException;

class LoginService
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
        }catch(\Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'internal server error',
            ], 500);
        }
    }

    public function login($email, $password){
        try{
            $valEmail = $this->validate->validateEmail($email);
            $valPassword = $this->validate->validatePassword($password);

            if($valEmail && $valPassword){
                $result = $this->loginProcess($email, $password);
                return $result;
            }else { 
                return response()->json([
                    'status' => 422,
                    'errors' => 'bad params',
                    'message' => 'invalid parameters',
                ], 422);
            }
        }catch (ValidationException $e){
            return response()->json([
                'status' => 422,
                'message' => 'validation error',
                'errors' => $e->errors()
            ]);
        }
    }


    // autologin
    private function autoLoginProcess($email){

    }

    public function autoLogin($email){

    }

    // logout
    private function logoutProcess(){

    }

    public function logout(){
        
    }

    // check if user is logged in
    public function isLoggedInProcess(){

    }
}
