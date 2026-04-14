<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['user_id', 'coding_task_id', 'status', 'content', 'code_language'])]

class Solution extends Model
{
    use SoftDeletes;
    protected function casts()
    {
        return[
            'content' => 'array',
            'created_at'=>'datetime',
            'updated_at'=>'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function coding_task() : BelongsTo{
        return $this->belongsTo(CodingTask::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(SolutionResult::class);
    }
}
