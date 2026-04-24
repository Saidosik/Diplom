<?php

namespace App\Http\Requests\Lesson;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'alpha_dash', 'max:255', 'unique:lessons,slug'],
            'description' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'status' => ['sometimes', Rule::in(['off', 'visible'])],
        ];
    }
}