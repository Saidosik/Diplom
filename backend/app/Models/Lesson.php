<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable('name', 'order', 'description', 'status', 'module_id')]
class Lesson extends Model
{
    protected function casts()
    {
        return[
            'order' => 'integer',
            'created_at'=>'datetime',
            'updated_at'=>'datetime',
        ];
    }

    public function lesson_block(): HasMany
    {
        return $this->hasMany(LessonBlock::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}
