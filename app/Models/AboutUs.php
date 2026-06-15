<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutUs extends Model
{
    protected $table = 'about_us';

    protected $fillable = [
        'title', 'description_1', 'description_2', 'image', 'highlights', 'vision',
    ];

    protected $casts = ['highlights' => 'array'];
}
