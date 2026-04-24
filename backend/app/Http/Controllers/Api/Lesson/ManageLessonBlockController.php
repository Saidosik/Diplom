<?php

namespace App\Http\Controllers\Api\Lesson;

use App\Http\Controllers\Controller;
use App\Http\Requests\LessonBlock\StoreLessonBlockRequest;
use App\Http\Requests\LessonBlock\UpdateLessonBlockRequest;
use App\Http\Resources\LessonBlockResource;
use App\Models\Lesson;
use App\Models\LessonBlock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ManageLessonBlockController extends Controller
{
    public function store(StoreLessonBlockRequest $request, Lesson $lesson)
    {
        $this->authorize('create', [LessonBlock::class, $lesson]);

        $lessonBlock = DB::transaction(function () use ($request, $lesson) {
            $validated = $request->validated();

            $lockedLesson = Lesson::query()
                ->whereKey($lesson->id)
                ->lockForUpdate()
                ->firstOrFail();

            $nextSortOrder = ($lockedLesson->lessonBlocks()->max('sort_order') ?? 0) + 1;

            return $lockedLesson->lessonBlocks()->create([
                'name' => $validated['name'],
                'slug' => $validated['slug'] ?? $this->makeUniqueSlug($validated['name']),
                'description' => $validated['description'] ?? null,
                'sort_order' => $validated['sort_order'] ?? $nextSortOrder,
                'status' => $validated['status'] ?? 'off',
                'type' => $validated['type'],
            ]);
        });

        $lessonBlock->loadMissing([
            'lesson:id,module_id,name,slug',
            'test:id,lesson_block_id,name,status',
            'codingTask:id,lesson_block_id,name,status',
        ])->loadCount([
            'contents',
            'progress',
            'comments',
        ]);

        return (new LessonBlockResource($lessonBlock))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateLessonBlockRequest $request, LessonBlock $lessonBlock)
    {
        $this->authorize('update', $lessonBlock);

        $lessonBlock->update($request->validated());

        $lessonBlock->loadMissing([
            'lesson:id,module_id,name,slug',
            'test:id,lesson_block_id,name,status',
            'codingTask:id,lesson_block_id,name,status',
        ])->loadCount([
            'contents',
            'progress',
            'comments',
        ]);

        return new LessonBlockResource($lessonBlock);
    }

    public function destroy(LessonBlock $lessonBlock)
    {
        $this->authorize('delete', $lessonBlock);

        if ($this->hasUserActivity($lessonBlock)) {
            return response()->json([
                'message' => 'Нельзя удалить lesson block, по которому уже есть пользовательская активность. Переведи его в status=off.',
            ], 422);
        }

        $lessonBlock->delete();

        return response()->json([
            'message' => 'Lesson block удалён',
        ]);
    }

    protected function hasUserActivity(LessonBlock $lessonBlock): bool
    {
        if ($lessonBlock->progress()->exists()) {
            return true;
        }

        if ($lessonBlock->type === 'test') {
            return $lessonBlock->test()->whereHas('testAttempts')->exists();
        }

        if ($lessonBlock->type === 'coding_task') {
            return $lessonBlock->codingTask()->whereHas('solutions')->exists();
        }

        return false;
    }

    protected function makeUniqueSlug(string $value): string
    {
        $baseSlug = Str::slug($value);
        $slug = $baseSlug !== '' ? $baseSlug : 'lesson-block';
        $originalSlug = $slug;
        $counter = 1;

        while (LessonBlock::query()->where('slug', $slug)->exists()) {
            $slug = $originalSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}