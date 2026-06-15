<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('homepage', function (Blueprint $table) {
            $table->id();
            $table->string('hero_badge')->default('Cepat, Aman, dan Tepat Waktu');
            $table->string('hero_title');
            $table->string('hero_highlight');
            $table->text('hero_description');
            $table->string('hero_cta_primary')->default('Kirim Barang Sekarang');
            $table->string('hero_cta_secondary')->default('Pelajari Layanan Kami');
            $table->string('hero_image')->nullable();
            $table->integer('stat_years')->default(10);
            $table->integer('stat_clients')->default(500);
            $table->integer('stat_provinces')->default(34);
            $table->integer('stat_ontime')->default(99);
            $table->string('services_title')->default('Layanan Utama Kami');
            $table->text('services_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homepage');
    }
};
