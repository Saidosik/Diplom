<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable('name', 'order', 'status', 'standart_code', 'cpu_limits', 'ram_limits', 'time_limits')]
class CodingTask extends Model
{
    protected function casts()
    {
        return [
            'order' => 'integer',
            'standart_code' => 'array',
            
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function lesson_block(): BelongsTo
    {
        return $this->belongsTo(LessonBlock::class);
    }

    public function test_cases(): HasMany
    {
        return $this->hasMany(CodingTaskTestCases::class);
    }
}
