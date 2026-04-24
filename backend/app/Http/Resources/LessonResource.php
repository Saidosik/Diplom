<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'module_id' => $this->module_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'sort_order' => $this->sort_order,
            'status' => $this->status,

            'lesson_blocks_count' => $this->whenCounted('lessonBlocks'),
            'lesson_blocks' => LessonBlockResource::collection($this->whenLoaded('lessonBlocks')),

            'module' => $this->whenLoaded('module', function () {
                return [
                    'id' => $this->module->id,
                    'course_id' => $this->module->course_id,
                    'name' => $this->module->name,
                    'slug' => $this->module->slug,
                ];
            }),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}