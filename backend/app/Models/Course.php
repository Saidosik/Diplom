<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'description', 'status', 'price', 'author' ])]
class Course extends Model
{
    protected function casts()
    {
        return[
            'created_at'=>'datetime',
            'updated_at'=>'datetime',
            'price'=>'integer',
        ];
    }

    public function module(): HasMany
    {
        return $this->hasMany(Module::class);
    }
}

