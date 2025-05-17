<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Services\Auth\TokenService;

class TokenControl
{
    protected $tokenServices;

    public function __construct(TokenService $tokenService) {
        $this->tokenServices = $tokenService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('auth_token');
        $userId = $request->header('sender_id');
        $userEmail = $request->header('sender_email');


        if(empty($token) || empty($userId) || empty($userEmail)){
            return response()->json([
                'status' => 'error',
                'message' => 'lack of info'
            ],401);
        }

        $isValid = $this->tokenServices->checkUserToken($token,$userId,$userEmail);

        if(!$isValid){
            return response()->json([
                'status' => 'error',
                'message'=> 'session timeout pls login again'
            ],401);
        }
        $request->merge(['user_id' => $userId]);
        return $next($request);
    }
}