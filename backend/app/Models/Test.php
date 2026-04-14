<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'sort_order', 'status', 'lesson_block_id', 'description'])]
class Test extends Model
{
    use SoftDeletes;
    protected function casts()
    {
        return [
            'sort_order' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
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

    public function testAttempts(): HasMany
    {
        return $this->hasMany(TestAttempt::class);
    }

}

