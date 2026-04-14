<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $course = $this->route('course');

        return [
            'title' => ['sometimes', 'required', 'string', 'min:3', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique('courses', 'slug')->ignore($course?->id),
            ],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ];
    }
}