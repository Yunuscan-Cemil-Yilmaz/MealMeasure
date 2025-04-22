<?php

namespace App\Services\Auth;

use Illuminate\Auth\Events\Validated;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ValidateAuthDatas
{
    public static function validateEmail($email){
        $validator = Validator::make(
            ['email' => $email],
            ['email' => [
                'required',
                'email',
                'unique:users,user_email',
                'max:255',
                'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
            ]]
        );

        if($validator->fails()){
            $errors = $validator->errors();
            throw new ValidationException($validator, response()->json([
                'status' => 'error',
                'errors' => $errors,
                'message' => 'bad param for email'
            ]));
        }

        return true;
    }

    public static function validateEmailForExists($email){
        $validator = Validator::make(
            ['email' => $email],
            ['email' => [
                'required',
                'email',
                'max:255',
                'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
            ]]
        );

        if($validator->fails()){
            $errors = $validator->errors();
            throw new ValidationException($validator, response()->json([
                'status' => 'error',
                'errors' => $errors,
                'message' => 'bad param for email'
            ]));
        }

        return true;
    }


    public static function validateNames($name){
        $validator = Validator::make(
            ['name' => $name],
            ['name' => 'required|string|min:3|max:20|regex:/^[a-zA-Z\s]+$/']
        );

        if($validator->fails()){
            $errors = $validator->errors();
            throw new ValidationException($validator, response()->json([
                'status' => 'error',
                'errors' => $errors,
                'message' => 'bad param for name type params'
            ]));
        }

        return true;
    }

    public static function validateRegisterPassword($password, $passwordConfirmation){
        $validator = Validator::make(
            ['password' => $password, 'password_confirmation' => $passwordConfirmation], 
            [
                'password' => 'required|string|min:8|max:64',  
                'password_confirmation' => 'required|same:password',  
            ]
        );
        // to make specila characters mandatory: 
        // 'password' => 'required|string|min:8|max:64|regex:/[A-Z]/|regex:/[0-9]/|regex:/[\W_]/'

        if($validator->fails()){
            $errors = $validator->errors();
            throw new ValidationException($validator, response()->json([
                'status' => 'error',
                'errors' => $errors,
                'message' => 'bad param for password about new user'
            ]));
        }

        return true;
    }

    public static function validatePassword($password){
        $validator = Validator::make(
            ['password' => $password],
            ['password' => 'required|string|min:8|max:64']
        );
        // to make specila characters mandatory: 
        // 'password' => 'required|string|min:8|max:64|regex:/[A-Z]/|regex:/[0-9]/|regex:/[\W_]/'

        if($validator->fails()){
            $errors = $validator->errors();
            throw new ValidationException($validator, response()->json([
                'status' => 'error',
                'errors' => $errors,
                'message' => 'bad param for password'
            ]));
        }

        return true;
    }
}
