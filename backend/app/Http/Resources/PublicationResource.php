<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'type' => $this->type?->value,
            // 'type_label' => $this->type?->label(),

            'status' => $this->status?->value,
            // 'status_label' => $this->status?->label(),

            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,

            'cover_image_path' => $this->cover_image_path,
            'reading_time_minutes' => $this->reading_time_minutes,

            'published_at' => $this->published_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'author' => $this->whenLoaded('author', function () {
                return [
                    'name' => $this->author->name,
                ];
            }),

            'blocks' => PublicationBlockResource::collection(
                $this->whenLoaded('blocks')
            ),
        ];
    }
}
