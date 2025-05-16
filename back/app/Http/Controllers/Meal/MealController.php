<?php

namespace App\Http\Controllers\Meal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Exception;
use Illuminate\Auth\Events\Validated;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Http;

class MealController extends Controller
{
    public function addWithCal(Request $request){
        $cal = $request->input('cal_value');
        $userId = $request->input('user_id');
        $now = Carbon::now();

        if(empty($cal) || empty($userId) || empty($now)){
            return response()->json([
                'status' => 'error',
                'message' => 'bad_request',
                'response' => null
            ], 400);
        }

        try { 
            if (!is_numeric($cal) || intval($cal) != $cal || intval($cal) <= 0) {
                throw ValidationException::withMessages([
                    'cal_value' => ['Calorie must be a positive integer.']
                ]);
            }
            
            DB::insert(
                "INSERT INTO user_meal_days
                (user_id, meal_cal)
                VALUES 
                (:userId, :mealCal);", [ 
                    'userId' => $userId,
                    'mealCal' => $cal,
                ]
            );

            return response()->json([
                'status' => 'success',
                'message' => 'added_successful',
                'response' => null
            ], 200);
        } catch (QueryException $e) { 
            return response()->json([
                'status' => 'error',
                'message' => 'system_error',
                'response' => null
            ], 500);
        } catch (ValidationException $e) { 
            return response()->json([
                'status' => 'error',
                'message' => 'invalid_params',
                'response' => null
            ], 422);
        }
    }
    public function addwithImg(Request $request){

        $user_id = $request->input('user_id');
        


        if(empty($user_id) || !$request->hasFile('image') || !$request->file('image')->isValid()){
            return response()->json([
                'status' => 'error',
                'message' => 'invalid or missing image',
                'response' => null
            ],400);
        }

        $image = $request->file('image');
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

       
        try{
            if (!in_array($image->getMimeType(), $allowedMimeTypes)) {
               throw ValidationException::withMessages([
                'error' => ['type dismatch']
               ]);
            }

            $response = Http::timeout(600)
            ->withHeaders([
                'x-api-key' => 'f46659f0803acfad856c0bbd3137ca574709f3a04e9c80086d6cced45bad1a51'
            ])->attach(
                'image', 
                file_get_contents($image), 
                $image->getClientOriginalName() 
            )->post('http://127.0.0.1:5000/api/calorie-calculator/calculate');
            

            if($response['response'] == -1 || !$response){
                return response()->json([
                    'status' => 'error',
                    'message' => 'image dismatch',
                    'response' => null
                ], 501);
            }

            
            return response()->json([
                "status"=> "success",
                "message"=> "Calculated by system.",
                "response"=> $response['response']
            ], 200);

        }
        catch(ValidationException $e){
            return response()->json([
                'status' => 'error',
                'message' => 'system_error',
                'response' => $e->getMessage()
            ],422);
        }
    }
}
