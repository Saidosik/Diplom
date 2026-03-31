<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Получить список всех курсов (для всех пользователей).
     * Можно добавить фильтры: по статусу, автору и т.д.
     */
    public function index(Request $request)
    {
        // Получить только видимые курсы (status = 'visible')
        $courses = Course::where('status', 'visible')
            ->with(['modules' => function ($query) {
                // Загрузить модули с количеством уроков
                $query->withCount('lessons');
            }])
            ->paginate(10); // Пагинация по 10 курсов

        return CourseResource::collection($courses);
    }

    /**
     * Получить один курс с полной информацией (модули, уроки, блоки).
     * Для учеников: показать только видимые элементы.
     */
    public function show(Course $course)
    {
        // Проверить, что курс видимый
        if ($course->status !== 'visible') {
            return response()->json(['error' => 'Course not found'], 404);
        }

        // Загрузить связанные данные
        $course->load([
            'modules' => function ($query) {
                $query->where('status', 'visible')
                      ->orderBy('order')
                      ->with(['lessons' => function ($subQuery) {
                          $subQuery->where('status', 'visible')
                                   ->orderBy('order')
                                   ->with(['lesson_blocks' => function ($blockQuery) {
                                       $blockQuery->where('status', 'visible')
                                                  ->orderBy('order');
                                   }]);
                      }]);
            }
        ]);

        return new CourseResource($course);
    }
}
