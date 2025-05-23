<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table('users', function(Blueprint $table){
            $table->boolean('is_admin')->dafault(false)->after('user_email');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_admin');
        });
    }
};


//bir migrade dosyasını rolback yapmadan değişiklik yapamazsın search for it 
