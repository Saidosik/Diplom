<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable('name', 'order', 'description', 'status', 'type', 'lesson_id')]
class LessonBlock extends Model
{
    protected function casts()
    {
        return[
            'order' => 'integer',
            'created_at'=>'datetime',
            'updated_at'=>'datetime',
        ];
    }

    public function getType(){
        return $this->type;
    }

    public function hasTest(){
        
    }

    public function comment(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id')->where('parent_type', 'lesson_block');
    }

    public function content(): HasMany
    {
        return $this->hasMany(LessonBlockContent::class);
    }

    public function test(): HasMany
    {
        return $this->hasMany(Test::class);
    }
    public function coding_task(): HasMany
    {
        return $this->hasMany(CodingTask::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}
