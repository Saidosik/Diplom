<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable('user_id', 'commentable_id', 'commentable_type', 'parent_comment_id', 'content', 'status')]

class Comment extends Model
{
    use SoftDeletes;
    protected function casts()
    {
        return [
            'content' => 'array',
            'parent_comment_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',

        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function commentable()
    {
        return $this->morphTo();
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_comment_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_comment_id');
    }

    public function scopeRoots($query)
    {
        return $query->whereNull('parent_comment_id');
    }
}
