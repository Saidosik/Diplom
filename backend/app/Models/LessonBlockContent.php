<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable('sort_order', 'type', 'content', 'status', 'lesson_block_id')]

class LessonBlockContent extends Model
{
    use SoftDeletes;
    protected function casts()
    {
        return [
            'content' => 'array',
            'sort_order' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function lessonBlock()
    {
        return $this->belongsTo(LessonBlock::class);
    }
}

