<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'user_id';
    public $incrementing = true;

    protected $fillable = [
        'user_email',
        'is_admin',
        'user_name',
        'user_surname',
        'user_nickname',
        'user_password',
        'user_bmi',                 //where the fuck is_completed
        'user_tdee',
        'user_fav_diet_ids',
        'user_diet_id',
        'is_completed'
    ];

    protected $hidden = [
        'user_password'
    ];

    protected $casts = [
        'is_admin' => 'boolean',
        'is_completed' => 'boolean',
        'user_bmi' => 'double',
        'user_tdee' => 'double',
    ];

    public function getUserPassword() { return $this->user_password; }

    // functions : (how to use ?) : 
    
    // Add data:
    // $user = new User;
    // $user->user_name = 'Ahmet';
    // $user->user_surname = 'Yılmaz';
    // $user->user_email = 'ahmet@example.com';
    // $user->user_password = bcrypt('parola123'); // dont use just bycript !!
    // $user->save();

    // Get data:
    // $users = User::all(); // Get all users
    // $user = User::find(1); // get user with id 1
    // $users = User::where('user_name', 'Ahmet')->get(); // get user with name : 'Ahmet'

    // Data update: 
    // $user = User::find(1);
    // $user->email = 'new_email@example.com';
    // $user->save();

    // get timestamps : 
    public function getCreatedAtColumn() { return 'created_at'; }
    public function getUpdatedAtColumn() { return 'updated_at'; }
    // how to use ? :
    // $user = User::find(1) // get user with id 1
    // if($user){
    //     $createdAt = $user->getCreatedAtColumn();
    //     $updatedAt = $user->getUpdatedAtColumn();
    //     Log::info('Create user date: ' . $createdAt);
    //     Log::info('Update user date: ' . $updatedAt);
    // }
}
