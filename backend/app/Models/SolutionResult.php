<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(
    'solution_id',
    'coding_task_test_case_id', 
    'status', 
    'type', 
    'output', 
    'input',
    'error_message',
    'memory_usage', 
    'execution_time',
    
)]

class SolutionResult extends Model
{
    use SoftDeletes;
    protected function casts()
    {
        return[
            'output'=>'array',
            'input'=>'array',
            'error_message'=>'array',
            'memory_usage' => 'integer',
            'execution_time' => 'integer',
            'deleted_at' => 'datetime',
        ];
    }


    public function solution() :BelongsTo
    {
        return $this->belongsTo(Solution::class);
    }

    public function coding_task_test_case() : BelongsTo
    {
        return $this->belongsTo(CodingTaskTestCase::class);
    }
}

