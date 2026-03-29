<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable('order', 'type', 'content', 'status', 'lesson_block_id')]

class LessonBlockContent extends Model
{
    protected function casts()
    {
        return [
            'content' => 'array',
            'order' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function lesson_block()
    {
        return $this->belongsTo(LessonBlock::class);
    }
}
