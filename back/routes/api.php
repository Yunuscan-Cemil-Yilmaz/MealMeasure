<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



use App\Http\Controllers\TestController;
use App\Http\Controllers\Auth\AuthController;

Route::post('/test', [TestController::class, 'test']);

/**
 * @param $email
 * @param password
 * @param passwordAgain
 * @param name
 * @param surname
 * @param nickname
 * @param create_admin \\ true(1) or false(0)
 * @param token // not required \\ if doesnt admin user
 * @param admin_id // not required \\ if doesnt admin user
 * @param admin_email // not required \\ if doesnt admin user
 *
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auto-login', [AuthController::class, 'autoLogin']);