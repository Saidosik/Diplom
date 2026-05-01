<?php

namespace App\Http\Resources;

use App\Enums\PublicationBlockType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PublicationBlockResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $data = $this->content;

        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'sort_order' => $this->sort_order,
            'properties' => match ($this->type) {
                // Берем конкретные ключи из массива content
                PublicationBlockType::Heading => [
                    'text'  => $data['text'] ?? '',
                    'level' => $data['level'] ?? 1,
                ],
                PublicationBlockType::Image => [
                    'src'     => $data['src'] ?? '',
                    'alt'     => $data['alt'] ?? '',
                    'caption' => $data['caption'] ?? '',
                ],
                PublicationBlockType::Code => [
                    'code'     => $data['code'] ?? '',
                    'language' => $data['language'] ?? 'javascript',
                ],
                // Для параграфов, цитат и прочего, где есть просто 'text'
                PublicationBlockType::Paragraph,
                PublicationBlockType::Quote,
                PublicationBlockType::Warning => [
                    'text' => $data['text'] ?? '',
                ],
                default => $data,
            },
        ];
    }
}
