<?php

namespace App\Http\Controllers\Insight;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Insight\InsightServices;
use App\Models\Auth\User;

class InsightController extends Controller
{
    protected $insightServices;

    public function __construct(InsightServices $insightServices) {
        $this->insightServices = $insightServices;
    }

    public function calculate(Request $request){
        $validated = $request->validate([
        'weight' => 'required|numeric',
        'height' => 'required|numeric',
        'age' => 'required|integer',
        'gender' => 'required|in:male,female',
        'activity_factor' => 'required|numeric'
        ]); // bura hatalı ama onemsemeyebılırız

        
        $record = User::find($request->input('user_id')); // genel yaklasım once parametreye $request ten degiskene almak ama burada simdilik kalabilir
        
        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'there is no such a user'
            ], 404);
        }
        


        $bmiResult = $this->insightServices->calculateBMI($validated['weight'], $validated['height']);
        $tdeeResult = $this->insightServices->calculateTDEE(
            $validated['gender'],
            $validated['age'],
            $validated['weight'],
            $validated['height'],
            $validated['activity_factor']          
        );

        $record->update([
            'user_bmi' => $bmiResult['bmi'],
            'user_tdee' => $tdeeResult['tdee'],
            'is_completed' => true
 
        ]);

        // $record->bmi = $bmiResult['bmi'];
        // $record->tdee = $tdeeResult['tdee'];
        // $record->ıs_complıted = 1;
        // $record->save(); // alternatif (daha kullanisli)

        return response()->json([
            'status' => 'success',
            'message' => 'table updated',
            'is_completed' => 'true',
            'user_bmi' => $bmiResult['bmi'],
            'user_tdee' => $tdeeResult['tdee'],

            
        ], 200); // return 200 yok



        // bu seferlik boyle kalsım ama burada normalde try catchler olması lazım 
        // catche-lerin ayrilmasi lazim QueryException, ValidateException, Exception ....
        // suanlik gerek yok calisiyosa artık daha dokunma buraya
    }

}
