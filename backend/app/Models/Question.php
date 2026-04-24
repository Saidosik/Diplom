<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['content', 'sort_order', 'type', 'status', 'test_id'])]
class Question extends Model
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

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    public function answer(): HasOne
    {
        return $this->hasOne(Answer::class);
    }

    public function answerOptions(): HasMany
    {
        return $this->hasMany(AnswerOption::class);
    }
}

