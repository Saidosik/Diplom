<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable('name', 'order', 'status')]
class Test extends Model
{
    protected function casts()
    {
        return [
            'order' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function lesson_block(): BelongsTo
    {
        return $this->belongsTo(LessonBlock::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
