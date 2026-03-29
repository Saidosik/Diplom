<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable('name', 'order', 'description', 'course_id', 'status')]
class Module extends Model
{
    protected function casts()
    {
        return[
            'order' => 'integer',
            'created_at'=>'datetime',
            'updated_at'=>'datetime',
        ];
    }

    public function course() : BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function lesson() : HasMany
    {
        return $this->hasMany(Lesson::class);
    }
}
