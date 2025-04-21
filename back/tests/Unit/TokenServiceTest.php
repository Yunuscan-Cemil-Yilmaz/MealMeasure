<?php

namespace Tests\Unit;

use Tests\TestCase;
use app\Models\Auth\UserToken;
use App\Services\Auth\TokenService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\Concerns\InteractsWithDatabase;
use Illuminate\Support\Facades\DB;

class TokenServiceTest extends TestCase
{

    use RefreshDatabase; // for refresh to database !important
    use InteractsWithDatabase;

    protected TokenService $tokenService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tokenService = new TokenService();
    }

    /*
    *
    * @test
    *  create token test
    *  token for admin test
    *  create token for long term test
    *  create token for long term admmin token test
    *  validate token test
    *  validate admin token test
    *  reject token test
    *  reject admin token test
    *  reject admin token on authicancation test
    *  delete token test
    * you should have 3 user on your user table:
        mysql> INSERT INTO users (user_email, is_admin, user_name, user_surname, user_nickname, user_password, user_bmi, user_tdee, user_fav_diet_ids, user_diet_id)
        -> VALUES
        -> ('user1@example.com', 0, 'John', 'Doe', 'johndoe', 'password123', 22.5, 2000, '["diet1", "diet2"]', 'diet1'),
        -> ('user2@example.com', 1, 'Jane', 'Smith', 'janesmith', 'password456', 21.0, 1800, '["diet3", "diet4"]', 'diet3'),
        -> ('user3@example.com', 0, 'Bob', 'Brown', 'bobbrown', 'password789', 25.3, 2200, '["diet5", "diet6"]', 'diet5');
    */

    public function test_create_token_1(){
        $response = $this->tokenService->createUserToken('1','user1@example.com', false);
        $this->assertDatabaseHas('user_token', ['user_emaıl' => 'user1@example.com']);
    }

    public function test_create_token_2(){
        $response = $this->tokenService->createUserToken('2','user2@example.com', false);
        $this->assertDatabaseHas('user_token', ['user_emaıl' => 'user2@example.com']);
    }

    public function test_create_long_term_token(){
        $response = $this->tokenService->createUserToken('3', 'user2@example.com', true);
        $this->assertDatabaseHas('user_token', ['user_emaıl' => 'user3@example.com']);
    }
}
