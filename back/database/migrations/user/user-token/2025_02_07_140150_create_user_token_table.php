<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_token', function (Blueprint $table) {
            $table->id('token_id');
            $table->string('user_id')->nullable(false);
            $table->string('user_email')->nullable(false);
            $table->string('token')->nullable(false);
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));  // Şu anki zaman
            $table->timestamp('end_date')->default(DB::raw('(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 HOUR))'));
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('user_token');
    }
};
