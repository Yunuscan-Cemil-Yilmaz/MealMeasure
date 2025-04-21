<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('user_email')->unique()->nullable(false);
            $table->string('user_name')->default('name');
            $table->string('user_surname')->default('surname');
            $table->string('user_nickname')->default('nickname');
            $table->string('user_password')->nullable(false);
            $table->float('user_bmi')->default(null)->nullable(true);
            $table->float('user_tdee')->default(null)->nullable(true);
            $table->text('user_fav_diet_ids')->default(null)->nullable(true);
            $table->string('user_diet_id')->default(null)->nullable(true);
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
