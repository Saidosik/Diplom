<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonBlockContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'lesson_block_id' => $this->lesson_block_id,
            'sort_order' => $this->sort_order,
            'status' => $this->status,
            'type' => $this->type,
            'content' => $this->content,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}