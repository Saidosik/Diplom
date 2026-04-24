<?php

namespace App\Http\Controllers\Api\Lesson;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lesson\StoreLessonRequest;
use App\Http\Requests\Lesson\UpdateLessonRequest;
use App\Http\Resources\LessonResource;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Support\Str;

class ManageLessonController extends Controller
{
    public function store(StoreLessonRequest $request, Module $module)
    {
        $this->authorize('create', [Lesson::class, $module]);

        $validated = $request->validated();
        $nextSortOrder = ($module->lessons()->max('sort_order') ?? 0) + 1;

        $lesson = $module->lessons()->create([
            ...$validated,
            'slug' => $validated['slug'] ?? $this->makeUniqueSlug($validated['name']),
            'sort_order' => $validated['sort_order'] ?? $nextSortOrder,
            'status' => $validated['status'] ?? 'off',
        ]);

        $lesson->load('module:id,course_id,name,slug');
        $lesson->loadCount('lessonBlocks');

        return (new LessonResource($lesson))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateLessonRequest $request, Lesson $lesson)
    {
        $this->authorize('update', $lesson);

        $validated = $request->validated();

        if (! empty($validated['slug'])) {
            $validated['slug'] = $validated['slug'];
        }

        $lesson->update($validated);
        $lesson->load('module:id,course_id,name,slug');
        $lesson->loadCount('lessonBlocks');

        return new LessonResource($lesson);
    }

    public function destroy(Lesson $lesson)
    {
        $this->authorize('delete', $lesson);

        $lesson->delete();

        return response()->json([
            'message' => 'Урок удалён',
        ]);
    }

    protected function makeUniqueSlug(string $value): string
    {
        $baseSlug = Str::slug($value);
        $slug = $baseSlug !== '' ? $baseSlug : 'lesson';
        $originalSlug = $slug;
        $counter = 1;

        while (Lesson::query()->where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}