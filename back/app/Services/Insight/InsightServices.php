<?php

namespace App\Services\Insight;



class InsightServices
{
    public function calculateBMI(float $weightKg, float $heightCm): array
    {
        $heightM = $heightCm / 100;
        $bmi = $weightKg / ($heightM * $heightM);

        $category = match (true) {
            $bmi < 18.5 => 'Zayıf',
            $bmi < 25 => 'Normal',
            $bmi < 30 => 'Fazla kilolu',
            $bmi < 35 => 'Obez (1. derece)',
            $bmi < 40 => 'Obez (2. derece)',
            default => 'Morbid obez'
        };

        return [
            'bmi' => round($bmi, 2),
            'category' => $category
        ];
    }

    public function calculateTDEE(string $gender, int $age, float $weightKg, float $heightCm, float $activityFactor): array
    {
        if (strtolower($gender) === 'male') {
            $bmr = 88.362 + (13.397 * $weightKg) + (4.799 * $heightCm) - (5.677 * $age);
        } else {
            $bmr = 447.593 + (9.247 * $weightKg) + (3.098 * $heightCm) - (4.330 * $age);
        }

        $tdee = $bmr * $activityFactor;

        return [
            'bmr' => round($bmr, 2),
            'tdee' => round($tdee, 2),
            'maintain_weight' => round($tdee),
            'gain_weight' => round($tdee + 500),
            'lose_weight' => round($tdee - 500),
        ];
    }
}

