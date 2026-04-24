<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonBlockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $hasTest = $this->relationLoaded('test') ? $this->test !== null : null;
        $hasCodingTask = $this->relationLoaded('codingTask') ? $this->codingTask !== null : null;

        $requiresSetup = match ($this->type) {
            'theory' => false,
            'test' => $hasTest === null ? null : ! $hasTest,
            'coding_task' => $hasCodingTask === null ? null : ! $hasCodingTask,
            default => null,
        };

        return [
            'id' => $this->id,
            'lesson_id' => $this->lesson_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'sort_order' => $this->sort_order,
            'status' => $this->status,
            'type' => $this->type,

            'contents_count' => $this->whenCounted('contents'),
            'progress_count' => $this->whenCounted('progress'),
            'comments_count' => $this->whenCounted('comments'),

            'requires_setup' => $requiresSetup,

            'test' => $this->whenLoaded('test', function () {
                if (! $this->test) {
                    return null;
                }

                return [
                    'id' => $this->test->id,
                    'name' => $this->test->name,
                    'status' => $this->test->status,
                ];
            }),

            'coding_task' => $this->whenLoaded('codingTask', function () {
                if (! $this->codingTask) {
                    return null;
                }

                return [
                    'id' => $this->codingTask->id,
                    'name' => $this->codingTask->name,
                    'status' => $this->codingTask->status,
                ];
            }),

            'contents' => LessonBlockContentResource::collection($this->whenLoaded('contents')),

            'lesson' => $this->whenLoaded('lesson', function () {
                return [
                    'id' => $this->lesson->id,
                    'module_id' => $this->lesson->module_id,
                    'name' => $this->lesson->name,
                    'slug' => $this->lesson->slug,
                ];
            }),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}