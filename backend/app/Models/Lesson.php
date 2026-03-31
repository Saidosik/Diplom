<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable('name', 'sort_order', 'description', 'status', 'module_id')]
class Lesson extends Model
{
    use SoftDeletes;
    protected function casts()
    {
        return[
            'sort_order' => 'integer',
            'created_at'=>'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function lessonBlocks(): HasMany
    {
        return $this->hasMany(LessonBlock::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}

