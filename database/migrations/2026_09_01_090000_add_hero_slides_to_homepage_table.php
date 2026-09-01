<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('homepage', function (Blueprint $table) {
            $table->json('hero_slides')->nullable()->after('hero_image');
        });
    }

    public function down(): void
    {
        Schema::table('homepage', function (Blueprint $table) {
            $table->dropColumn('hero_slides');
        });
    }
};
