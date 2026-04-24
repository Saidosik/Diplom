<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'sort_order', 'status', 'standart_code', 'cpu_limit', 'ram_limit', 'time_limit', 'lesson_block_id'])]
class CodingTask extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'standart_code' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function lessonBlock(): BelongsTo
    {
        return $this->belongsTo(LessonBlock::class);
    }

    public function testCases(): HasMany
    {
        return $this->hasMany(CodingTaskTestCase::class);
    }

    public function solutions(): HasMany
    {
        return $this->hasMany(Solution::class);
    }
}