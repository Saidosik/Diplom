<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'description', 'status', 'price', 'author_id' ])]
class Course extends Model
{
    use SoftDeletes;
    protected function casts()
    {
        return[
            'created_at'=>'datetime',
            'updated_at'=>'datetime',
            'deleted_at' => 'datetime',
            'price'=>'integer',
        ];
    }

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

