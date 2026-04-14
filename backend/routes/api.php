<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\Admin\AdminCourseController;
use App\Http\Controllers\Api\ManageCourseController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Публичные курсы
Route::apiResource('courses', CourseController::class)
    ->only(['index', 'show']);

// Автор / админ
Route::middleware('jwt.auth')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    Route::get('/my/courses', [ManageCourseController::class, 'myCourses']);
    Route::post('/my/courses', [ManageCourseController::class, 'store']);
    Route::patch('/my/courses/{course}', [ManageCourseController::class, 'update']);
    Route::delete('/my/courses/{course}', [ManageCourseController::class, 'destroy']);
    Route::post('/my/courses/{course}/publish', [ManageCourseController::class, 'publish']);
});

// Админ
Route::prefix('admin')
    ->middleware(['jwt.auth', 'admin'])
    ->group(function () {
        Route::get('/courses', [AdminCourseController::class, 'index']);
        Route::get('/courses/{course}', [AdminCourseController::class, 'show']);
        Route::patch('/courses/{course}/status', [AdminCourseController::class, 'updateStatus']);
    });