<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

class ManageCourseController extends Controller
{
    public function store(StoreCourseRequest $request)
    {
        $this->authorize('create', Course::class);

        $course = Course::create([
            ...$request->validated(),
            'author_id' => $request->user()->id,
            'status' => 'draft',
        ]);

        $course->load('author_id:id,name');

        return (new CourseResource($course))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateCourseRequest $request, Course $course)
    {
        $this->authorize('update', $course);

        $course->update($request->validated());

        $course->load('author:id,name');

        return new CourseResource($course->fresh());
    }

    public function destroy(Course $course)
    {
        $this->authorize('delete', $course);

        $course->delete();

        return response()->json([
            'message' => 'Курс удалён',
        ]);
    }

    public function publish(Course $course)
    {
        $this->authorize('publish', $course);

        $course->update([
            'status' => 'published',
        ]);

        return new CourseResource($course->fresh());
    }

    public function myCourses(Request $request)
    {
        $courses = Course::query()
            ->where('author_id', $request->user()->id)
            ->withCount('modules')
            ->latest()
            ->paginate(12);

        return CourseResource::collection($courses);
    }
}

