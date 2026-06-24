<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $fillable = ['title', 'description', 'type', 'file', 'video_url', 'sort_order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}
