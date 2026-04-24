<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable('name', 'slug', 'status', 'author_id', 'description', )]

class Tag extends Model
{
    //
}
