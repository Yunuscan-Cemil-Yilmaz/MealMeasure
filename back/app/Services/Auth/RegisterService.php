<?php

namespace App\Services\Auth;

use App\Models\Auth\User;
use App\Services\Auth\PasswordService;
use App\Services\Auth\ValidateAuthDatas;

use Illuminate\Validation\ValidationException;

class RegisterService
{
    protected $passwordService;
    protected $userModel;
    protected $validate;
    public function __construct(
        User $userModel,
        PasswordService $passwordService,
        ValidateAuthDatas $validateAuthDatas
    ) {
        $this->userModel = $userModel;
        $this->passwordService = $passwordService;
        $this->validate = $validateAuthDatas;
    }

    private function createUserProcess(){

    }

    public function createUser($email, $password, $passwordAgain, $isAdmin, $name, $surname, $nickname){
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

            }else { 
                return response()->json([
                    'status' => 'error',
                    'errors' => 'bad params',
                    'message' => 'unvalid parameters'
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
