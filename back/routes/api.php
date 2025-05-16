<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



use App\Http\Middleware\TokenControl;
use App\Http\Controllers\TestController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Insight\InsightController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Settings\SettingsController;
use App\Http\Controllers\Calendar\CalendarController;
use App\Http\Controllers\Meal\MealController;

Route::post('/test', [TestController::class, 'test']);

/**
 * @param email
 * @param password
 * @param passwordAgain
 * @param name
 * @param surname
 * @param nickname
 * @param create_admin => true(1) or false(0)
 * @param token => not required | if doesnt admin user
 * @param admin_id => not required | if doesnt admin user
 * @param admin_email => not required | if doesnt admin user
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

Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware([TokenControl::class])->group(function() {
    /**
     * @param int age
     * @param string gender
     * @param int weight
     * @param int height 
     * @param string activityLevel 
     */
    Route::post('/insight',[InsightController::class,'calculate']);

    Route::post('/settings',[SettingsController::class,'update']);


    Route::post('get-meals-cal-from-date', [CalendarController::class, 'getMealsFromDate']);

    Route::post('add-meal-with-cal', [MealController::class, 'addWithCal']);

    Route::post('add-meal-with-img',[MealController::class, 'addWithImg']);
});


// http://127.0.0.1:5000/api/calorie-calculator/calculate
// x-api-key .env -> config -> dosya oluşturulcak api koy burda  APP_KEY = f46659f0803acfad856c0bbd3137ca574709f3a04e9c80086d6cced45bad1a51 
// body image => resmin kendisini (.jpg, png, jpeg, webp.. resmin kendisi ! .avif, svg)

// 'xapikey' => 'Bearer YOUR_API_KEY_HERE', // veya 'X-API-Key' => '...'
// 'nutriaiappkey-appkey-for-laravel-appasd_lkajsdklajsdkljaskdjaskdjaujvjhs' ->x
// x + '_nutrisaltdasdasd' -> y salt hashing beaver
// y -> bareer_y_sadasdasdasd -> y