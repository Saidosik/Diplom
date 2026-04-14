<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->integer('per_page', 12), 50);

        $courses = Course::query()
            ->where('status', 'published')
            ->with('author:id,name')
            ->withCount('modules')
            ->latest()
            ->paginate($perPage);

        return CourseResource::collection($courses);
    }

    public function show(Course $course)
    {
        $this->authorize('view', $course);

        $course->load('author:id,name');
        $course->loadCount('modules');

        return new CourseResource($course);
    }
}