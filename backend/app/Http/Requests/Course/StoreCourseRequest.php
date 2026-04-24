<?php

namespace App\Http\Requests\Course;

use App\Models\Course;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null 
        &&$this->user()->can('create', Course::class) ;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'slug' => ['required', 'string', 'alpha_dash', 'max:255', 'unique:courses,slug'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
