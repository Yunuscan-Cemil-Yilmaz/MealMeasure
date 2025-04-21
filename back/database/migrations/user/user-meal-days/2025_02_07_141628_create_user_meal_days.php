<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_meal_days', function (Blueprint $table) {
            $table->string('user_id')->nullable(false);
            $table->integer('meal_cal')->nullable(false);
            $table->timestamp('meal_date')->default(DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_meal_days');
    }
};
