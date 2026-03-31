<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;

use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

class AdminCourseController extends Controller
{
    /**
     * Получить список всех курсов (для админов, включая невидимые).
     * Можно добавить фильтры.
     */
    public function index(Request $request)
    {
        $courses = Course::with(['modules' => function ($query) {
            $query->withCount('lessons');
        }])->paginate(10);

        return CourseResource::collection($courses);
    }

    /**
     * Создать новый курс (только для админов).
     * Используем Form Request для валидации и авторизации.
     */
    public function store(StoreCourseRequest $request)
    {
        // Валидация и авторизация уже в StoreCourseRequest
        $validated = $request->validated();

        // Создать курс
        $course = Course::create($validated);

        return new CourseResource($course);
    }

    /**
     * Получить один курс с полной информацией (для админов).
     */
    public function show(Course $course)
    {
        // Загрузить все связанные данные (без фильтров по статусу)
        $course->load([
            'modules' => function ($query) {
                $query->orderBy('order')
                      ->with(['lessons' => function ($subQuery) {
                          $subQuery->orderBy('order')
                                   ->with(['lesson_blocks' => function ($blockQuery) {
                                       $blockQuery->orderBy('order');
                                   }]);
                      }]);
            }
        ]);

        return new CourseResource($course);
    }

    /**
     * Обновить курс (только админы).
     */
    public function update(UpdateCourseRequest $request, Course $course)
    {
        // Валидация и авторизация в UpdateCourseRequest
        $validated = $request->validated();

        // Обновить
        $course->update($validated);

        return new CourseResource($course);
    }

    /**
     * Удалить курс (только админы, мягкое удаление).
     */
    public function destroy(Course $course)
    {
        // Мягкое удаление
        $course->delete();

        return response()->json(['message' => 'Course deleted']);
    }
}