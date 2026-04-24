<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name','slug', 'sort_order', 'description', 'status', 'type', 'lesson_id'])]
class LessonBlock extends Model
{
    use SoftDeletes;
    protected function casts()
    {
        return[
            'type' => 'string',
            'sort_order' => 'integer',
            'created_at'=>'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function getType(){
        return $this->type;
    }

    public function hasTest(){
        if ($this->hasOne(Test::class)->exists()){
            return true;
        }        return false;
    }

    public function hasCodingTasks(){
        if($this->hasMany(CodingTask::class)->exists())
        {
            return true;
        }        return false;
    }

    public function contents(): HasMany
    {
        return $this->hasMany(LessonBlockContent::class)->orderBy('sort_order');
    }

    public function test(): HasOne
    {
        return $this->hasOne(Test::class);
    }

    public function codingTask(): HasOne
    {
        return $this->hasOne(CodingTask::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(Progress::class);
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

