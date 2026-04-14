<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUpdateCourseStatusRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

class AdminCourseController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('adminViewAny', Course::class);

        $perPage = min((int) $request->integer('per_page', 20), 100);

        $courses = Course::query()
            ->with('author:id,name')
            ->withCount('modules')
            ->latest()
            ->paginate($perPage);

        return CourseResource::collection($courses);
    }

    public function show(Course $course)
    {
        $this->authorize('view', $course);

        $course->load('author_id:id,name');
        $course->loadCount('modules');

        return new CourseResource($course);
    }

    public function updateStatus(AdminUpdateCourseStatusRequest $request, Course $course)
    {
        $this->authorize('forceStatus', $course);

        $course->update([
            'status' => $request->validated('status'),
        ]);

        return new CourseResource($course->fresh());
    }
}