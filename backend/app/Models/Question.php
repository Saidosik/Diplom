<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable('content', 'order', 'type', 'status')]
class Question extends Model
{
    protected function casts()
    {
        return [
            'order' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    public function answwer(): HasMany
    {
        return $this->hasMany(Answwer::class);
    }

    public function answwer_options(): HasMany
    {
        return $this->hasMany(AnswwerOptions::class);
    }
}
