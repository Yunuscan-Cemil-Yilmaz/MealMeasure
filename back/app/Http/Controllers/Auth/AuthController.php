<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\Auth\RegisterService;
use App\Services\Auth\LoginService;

class AuthController extends Controller
{
    protected $registerService;
    protected $loginService;
    public function __construct(
        RegisterService $registerService,
        LoginService $loginService
    ) {
        $this->registerService = $registerService;
        $this->loginService = $loginService;
    }

    private function findRegisterReturn($code) { 
        if($code == 200){
            return [ 'status' => 200, 'message' => 'user created' ];
        } else if($code == 400){
            return [ 'status' => 400, 'message' => 'user already exists' ];
        } else if($code == 401){
            return [ 'status' => 401, 'message' => 'unauthorized' ];
        } else if($code == 500){
            return [ 'status' => 500, 'message' => 'error while create user process' ];
        } else {
            return [ 'status' => 500, 'message' => 'unknown error' ];
        }
    }

    public function register(Request $request){
        $email = $request->input('email');
        $password = $request->input('password');
        $passwordAgain = $request->input('passwordAgain');
        $name = $request->input('name');
        $surname = $request->input('surname');
        $nickname = $request->input('nickname');

        $isAdminCreate = $request->input('create_admin');
        if($isAdminCreate){
            $token = $request->input('token');
            $adminId = $request->input('admin_id');
            $adminEmail = $request->input('admin_email');
            try { 
                $result = $this->registerService->createUser($email, $password, $passwordAgain, $name, $surname, $nickname, 1, $token, $adminId, $adminEmail);
                $res = $this->findRegisterReturn($result['status']);
                return response()->json([
                    'status' => $res['status'],
                    'message' => $res['message']
                ], $res['status']);
            }catch(\Exception $e){
                return response()->json([
                    'status' => 500, // $a['status];
                    'message' => 'error while create admin user process: ' . $e->getMessage()
                ]);
            }
        } else {
            try { 
                $result = $this->registerService->createUser($email, $password, $passwordAgain, $name, $surname, $nickname);
                $res = $this->findRegisterReturn($result['status']);
                return response()->json([
                    'status' => $res['status'],
                    'message' => $res['message']
                ], $res['status']);
            }catch(\Exception $e){
                return response()->json([
                    'status' => 500,
                    'message' => 'error while create user process: ' . $e->getMessage()
                ]);
            }
        }
    }

    public function login(Request $request){
        $email = $request->input('email');
        $password = $request->input('password');
        $isLongTerm = $request->input('long_term');
        try {
            if($isLongTerm) $result = $this->loginService->login($email, $password, true);
            else $result = $this->loginService->login($email, $password);
            return $result;
        }catch (\Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'error while login user process: ' . $e->getMessage()
            ]);
        }
    }

    public function autoLogin(Request $request){
        $userId = $request->input('user_id');
        $email = $request->input('email');
        $token = $request->input('token');

        try {
            if(empty($userId) || empty($email) || empty($token)){
                return response()->json([
                    'status' => 422,
                    'message' => 'validation error',
                ], 422);
            }
            $result = $this->loginService->autoLogin($userId, $email, $token);
            return $result;
        }catch (\Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'error while auto login user process: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request){
        $userId = $request->input('user_id');

        try {
            if(empty($userId)){
                return response()->json([
                    'status' => 422,
                    'message' => 'validation error',
                ], 422);
            }
            $result = $this->loginService->logout($userId);
            return $result;
        }catch (\Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'error while logout user process: ' . $e->getMessage()
            ]);
        }
    }
}
