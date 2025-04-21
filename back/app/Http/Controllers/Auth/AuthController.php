<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Auth\RegisterService;

class AuthController extends Controller
{
    protected $registerService;
    public function __construct(
        RegisterService $registerService
    ) {
        $this->registerService = $registerService;
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
                    'status' => 500,
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
}
