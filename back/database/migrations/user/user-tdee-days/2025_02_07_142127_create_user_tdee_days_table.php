<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_tdee_days', function (Blueprint $table) {
            $table->string('user_id')->nullable(false);
            $table->float('user_tdee')->nullable(false);
            $table->float('user_tdee_current')->default(0)->nullable(false);
            $table->date('user_tdee_date')->nullable(false);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('user_tdee_days');
    }
};
