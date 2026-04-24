<?php

namespace App\Http\Controllers\Api;

use App\Enums\CourseStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Course\IndexCourseRequest;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(IndexCourseRequest $request)
    {
        $search = $request->string('search')->toString();

        $courses = Course::query()
        ->published()
        ->withCatalogData();

        return response()->json(CourseResource::collection($courses));
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(StoreCourseRequest $request)
    // {
    //     //
    // }2

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(UpdateCourseRequest $request, Course $course)
    // {
    //     //
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        //
    }
}
