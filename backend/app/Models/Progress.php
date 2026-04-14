<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['user_id', 'status', 'lesson_block_id'])]

class Progress extends Model
{
    use SoftDeletes;
    protected function casts()
    {
        return[
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lessonBlock() : BelongsTo
    {
        return $this->belongsTo(LessonBlock::class);
    }
}