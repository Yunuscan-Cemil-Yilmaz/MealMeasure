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

class RegisterService
{
    protected $passwordService;
    protected $userModel;
    protected $validate;
    protected $tokenService;
    public function __construct(
        User $userModel,
        PasswordService $passwordService,
        ValidateAuthDatas $validateAuthDatas,
        TokenService $tokenService
    ) {
        $this->userModel = $userModel;
        $this->passwordService = $passwordService;
        $this->validate = $validateAuthDatas;
        $this->tokenService = $tokenService;
    }

    private function createUserProcess($email, $password, $name, $surname, $nickname, $isAdmin=0){
        try{
            $hashedPassword = $this->passwordService->hashPassword($password);
            $user = new User();
            $user->user_email = $email;
            $user->user_name = $name;
            $user->user_surname= $surname;
            $user->user_nickname = $nickname;
            $user->user_password = $hashedPassword;
            if ($isAdmin) { $user->is_admin = 1; }
            else { $user->is_admin = 0; }
            $user->save();
            return response()->json([
                'status' => 200,
                'message' => 'user created with successfuly'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'error while create user process: ' . $e->getMessage()
            ]);
        }
    }

    public function createUser($email, $password, $passwordAgain, $name, $surname, $nickname, $isAdmin=0, $token=null, $adminId=null, $adminEmail=null){
        try {
            // email
            $valEmail = $this->validate->validateEmail($email);
            // name
            $valName = $this->validate->validateNames($name);
            // surname
            $valSurname = $this->validate->validateNames($surname);
            // nickname
            $valNickname = $this->validate->validateNames($nickname);
            // password
            $valPassword = $this->validate->validateRegisterPassword($password, $passwordAgain);
            
            if(
                $valName && $valSurname && $valNickname
                && $valEmail && $valPassword
            ){
                // check admin token
                if($isAdmin){
                    $validateAdmin = $this->tokenService->checkAdminToken($token, $adminId, $adminEmail);
                    if($validateAdmin){
                        $result = $this->createUserProcess($email, $password, $name, $surname, $nickname, $isAdmin);
                        return $result;
                    }else {
                        return response()->json([
                            'status' => 400,
                            'message' => 'unauthorize process'
                        ]);
                    }
                }else {
                    $result = $this->createUserProcess($email, $password, $name, $surname, $nickname);
                    return $result;
                }
            }else { 
                return response()->json([
                    'status' => 'error',
                    'errors' => 'bad params',
                    'message' => 'invalid parameters'
                ], 422);
            }
        }catch (ValidationException $e) { 
            $errors = $e->errors();

            foreach ($errors as $field => $messages) {
                if (strpos($messages[0], 'bad param for password') !== false) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Password validation failed',
                        'errors' => $messages
                    ], 422);
                }
    
                if (strpos($messages[0], 'bad param for email') !== false) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Email validation failed',
                        'errors' => $messages
                    ], 422);
                }
    
                if (strpos($messages[0], 'bad param for name') !== false) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Names (name || surname || nickname || validation failed',
                        'errors' => $messages
                    ], 422);
                }
    
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $messages
                ], 422);
            }
        }
    }
}
