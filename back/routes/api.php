<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



use App\Http\Middleware\TokenControl;
use App\Http\Controllers\TestController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Insight\InsightController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Settings\SettingsController;

Route::post('/test', [TestController::class, 'test']);

/**
 * @param email
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

/**
 * @param email
 * @param password
 * @param long_term bool // true for long term token || false
 */
Route::post('/login', [AuthController::class, 'login']);

/**
 * @param user_id
 * @param email
 * @param token
 */
Route::post('/auto-login', [AuthController::class, 'autoLogin']);

/**
 * @param user_id
 */





//php artisan make:middleware TokenControl
//php artisan make:controller Inside/InsideController 
//php artisan make:class Services/Inside/InsideServices

Route::middleware([TokenControl::class])->group(function() {
    Route::post('/insight',[InsightController::class,'calculate']);
    /**
     * @param int age
     * @param string gender
     * @param int weight
     * @param int height 
     * @param string activityLevel 
     */

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/settings',[SettingsController::class,'update']);
    Route::post('/home',[HomeController::class,'//']);
    //home and settings

});


