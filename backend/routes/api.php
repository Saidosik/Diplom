<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\Lesson\ManageLessonBlockController;
use App\Http\Controllers\Api\Lesson\ManageLessonController;
use App\Http\Controllers\Api\SocialAuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('refresh')->group(function () {
    Route::post('/refresh', [AuthController::class, 'refresh']);
});

Route::prefix('oauth')->group(function () {
    Route::get('/{provider}/redirect-url', [SocialAuthController::class, 'redirectUrl']);
    Route::get('/{provider}/callback', [SocialAuthController::class, 'callback']);
});

Route::apiResource('courses', CourseController::class)
    ->only(['index', 'show']);

Route::middleware('jwt')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/my/modules/{module}/lessons', [ManageLessonController::class, 'store']);
    Route::patch('/my/lessons/{lesson}', [ManageLessonController::class, 'update']);
    Route::delete('/my/lessons/{lesson}', [ManageLessonController::class, 'destroy']);

    Route::post('/my/lessons/{lesson}/blocks', [ManageLessonBlockController::class, 'store']);
    Route::patch('/my/lesson-blocks/{lessonBlock}', [ManageLessonBlockController::class, 'update']);
    Route::delete('/my/lesson-blocks/{lessonBlock}', [ManageLessonBlockController::class, 'destroy']);
});

Route::prefix('admin')
    ->middleware(['jwt', 'admin'])
    ->group(function () {
        //
    });
