<?php

namespace App\Http\Requests\Course;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $course = $this()->route('course');
        return $this->user() !== null
            && $course !== null
            && $this->user()->can('update', $course);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $course = $this->route('course');
        return [
            'name' => ['sometimes', 'required', 'string', 'min:3', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique('courses', 'slug')->ignore($course?->id),
            ],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
