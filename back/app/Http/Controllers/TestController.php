<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Auth\TokenService;
use App\Services\Auth\RegisterService;

class TestController extends Controller
{
    protected $tokenService;
    protected $registerService;
    public function __construct(
        TokenService $tokenService,
        RegisterService $registerService
    ) {
        $this->tokenService = $tokenService;
        $this->registerService = $registerService;

    }
    public function test(Request $request)
    {
        try{
            $email = $request->input('email');
            $password = $request->input('password');
            $passwordAgain = $request->input('passwordAgain');
            $name = $request->input('name');
            $surname = $request->input('surname');
            $nickname = $request->input('nickname');
            
            $test = $this->registerService->createUser($email, $password, $passwordAgain, $name, $surname, $nickname);
            return $test;
        }catch(\Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'error while create user process: ' . $e->getMessage()
            ]);
        }
    }
}
