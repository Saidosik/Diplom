<?php

use App\Http\Controllers\Api\Publication\PublicationController;
use App\Http\Controllers\Api\User\SocialAuthController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\User\AuthController;
use App\Http\Controllers\Api\User\PasswordController;
use App\Http\Controllers\Api\User\VerifyEmailAcountController;

Route::get('/publications', [PublicationController::class, 'index']);

Route::get('/publications/{publication}', [PublicationController::class, 'show']);


Route::prefix('oauth')->group(function () {
    Route::get('/{provider}/redirect-url', [SocialAuthController::class, 'redirectUrl']);
    Route::get('/{provider}/callback', [SocialAuthController::class, 'callback']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::post('/forgot-password', [PasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordController::class, 'reset']);

Route::get('/email/verify/{id}', [VerifyEmailAcountController::class, 'verify'])
    ->name('verification.verify');


Route::middleware('jwt')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});
