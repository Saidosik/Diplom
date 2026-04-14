<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'author_id' => $this->author_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'status' => $this->status,

            'author' => $this->whenLoaded('author_id', function () {
                return [
                    'id' => $this->author->id,
                    'name' => $this->author->name,
                ];
            }),

            'modules_count' => $this->whenCounted('modules'),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}