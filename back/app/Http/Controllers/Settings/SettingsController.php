<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Auth\User;

class SettingsController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:50',
            'user_surname' => 'required|string|max:50',
            'user_nickname' => 'required|string|max:50',
        ]);

        $user = User::find($request->input('user_id'));

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        $user->update([
            'user_name' => $validated['user_name'],
            'user_surname' => $validated['user_surname'],
            'user_nickname' => $validated['user_nickname']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User info updated',
            'user' => $user
        ]);

        
    }
}
