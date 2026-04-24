<?php

namespace App\Http\Requests\Lesson;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $lesson = $this->route('lesson');

        return [
            'name' => ['sometimes', 'required', 'string', 'min:3', 'max:255'],
            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique('lessons', 'slug')->ignore($lesson?->id),
            ],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'sort_order' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'status' => ['sometimes', Rule::in(['off', 'visible'])],
        ];
    }
}