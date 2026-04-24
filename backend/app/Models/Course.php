<?php

namespace App\Models;

use App\Enums\CourseStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Query\Builder;

#[Fillable(['name', 'description', 'status', 'price', 'author_id', 'slug'])]


class Course extends Model
{
    use SoftDeletes;
    protected function casts()
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
            'price' => 'integer',
            'status' => CourseStatus::class
        ];
    }

    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('status', CourseStatus::Published);
    }
    protected function withCatalogData(Builder $query) : void
    {
        $query->withCount('modules');
    }
    protected function scopeSearchByName(Builder $query, ?string $search) : Builder
    {
        if(!$search){
            return $query;
        }
        return $query->select('courses.*')
        ->selectRaw('similarity(name, ?) as similarity', [$search])
        ->whereRaw('name % ?', [$search])
        ->orderBy('similarity');
    }

    protected function scopeApplySort(Builder $query, string $sort, string $direction, bool $hasSearch = false){

        $allowedSorts = ['name', 'created_at', 'price'];
        $allowedDirections = ['asc', 'desc'];

        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'name';
        $direction = in_array($direction, $allowedDirections, true) ? $direction : 'asc';

        // Если поиск активен, сортировка по similarity уже добавлена.
        // Мы добавляем второстепенную сортировку только если нужно.
        return $query->orderBy($sort, $direction);
    }

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('sort_order');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function isPublished(): bool
    {
        return $this->status === CourseStatus::Published;
    }
}
