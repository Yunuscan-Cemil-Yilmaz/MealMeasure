<?php

namespace App\Services\Calendar;

use App\Services\User\UserService;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class CalendarService extends UserService
{
    public function __construct() { }

    private function listMeals($userId, $date){
        return DB::table('user_meal_days')
        ->where('user_id', $userId)
        ->whereDate('meal_date', '=', $date)
        ->orderBy('meal_date', 'asc')
        ->get();
    }

    public function listFromCalendar($userId, $date)
    {
        $checkUser = $this->isUserExistsById($userId);
        if (!$checkUser) return [];
    
        $d = \DateTime::createFromFormat('Y-m-d', $date);
        if (!($d && $d->format('Y-m-d') === $date)) {
            throw ValidationException::withMessages([
                'selected_date' => ['Geçersiz tarih formatı. Format YYYY-MM-DD olmalı.'],
            ]);
        };
    
        $result = $this->listMeals($userId, $date);
        if ($result->isEmpty()) return [];
        
        return $result;
    }
}
