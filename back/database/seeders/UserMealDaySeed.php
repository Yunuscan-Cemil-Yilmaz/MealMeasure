<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class UserMealDaySeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Kullanıcı ID'lerini `users` tablosundan al
        $userIds = DB::table('users')->pluck('user_id')->toArray();

        // Son 7 gün için veri üret
        for ($i = 0; $i < 30; $i++) {
            $date = Carbon::now()->subDays($i)->startOfDay();

            foreach ($userIds as $userId) {
                // Bu kullanıcı için bugüne 2–4 arasında öğün oluştur
                $mealCount = rand(2, 4);

                for ($j = 0; $j < $mealCount; $j++) {
                    DB::table('user_meal_days')->insert([
                        'user_id'   => $userId,
                        'meal_cal'  => rand(300, 900), // 300–900 arası kalori
                        'meal_date' => $date->copy()->addHours(rand(7, 20)), // 07:00–20:00 arasında rastgele saat
                    ]);
                }
            }
        }
    }
}