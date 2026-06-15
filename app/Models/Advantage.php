<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Advantage extends Model
{
    protected $fillable = ['title', 'description', 'icon', 'color', 'sort_order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}
