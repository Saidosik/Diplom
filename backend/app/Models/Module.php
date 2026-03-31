<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable('name', 'sort_order', 'description', 'course_id', 'status')]
class Module extends Model
{
    use SoftDeletes;
    protected function casts()
    {
        return[
            'sort_order' => 'integer',
            'created_at'=>'datetime',
            'updated_at'=>'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function course() : BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function lessons() : HasMany
    {
        return $this->hasMany(Lesson::class);
    }
}

