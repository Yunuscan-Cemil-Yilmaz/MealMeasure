<?php

namespace App\Http\Controllers\Calendar;

use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

use App\Services\Calendar\CalendarService;

class CalendarController extends Controller
{
    protected $calendarService;
    public function __construct(CalendarService $calendarService) {
        $this->calendarService = $calendarService;
    }

    public function getMealsFromDate(Request $request){
        $date = $request->input('selected_date');
        $userId = $request->input('user_id');
        if(empty($date) || empty($userId)){
            return response()->json([
                'status' => 'error',
                'message' => 'bad_request',
                'response' => null
            ], 400);
        }

        try{
            $response = $this->calendarService->listFromCalendar($userId, $date);
            if($response == []){
                return response()->json([
                    'status' => 'error',
                    'message' => 'not_found',
                    'response' => null
                ], 404);
            }
            if(!$response){
                return response()->json([
                    'status' => 'error',
                    'message' => 'system_error',
                    'response' => null
                ], 500);
            }
            return response()->json([
                'status' => 'success',
                'message' => 'list_meals_success',
                'response' => $response
            ], 200);
        } catch (QueryException $e){
            return response()->json([
                'status' => 'error',
                'message' => 'system_error',
                'response' => null
            ], 500);
        }catch(ValidationException $e){
            return response()->json([
                'status' => 'error',
                'message' => 'invalid_Date',
                'response' => null
            ], 422);
        } catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'system_error',
                'response' => null
            ], 500);
        }
    }
}
