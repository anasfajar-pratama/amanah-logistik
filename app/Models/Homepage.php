<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Homepage extends Model
{
    protected $table = 'homepage';

    protected $fillable = [
        'hero_badge', 'hero_title', 'hero_highlight', 'hero_description',
        'hero_cta_primary', 'hero_cta_secondary', 'hero_image', 'hero_slides',
        'stat_years', 'stat_clients', 'stat_provinces', 'stat_ontime',
        'services_title', 'services_description',
        'gallery_title', 'gallery_description',
    ];

    protected $casts = [
        'hero_slides' => 'array',
    ];
}
