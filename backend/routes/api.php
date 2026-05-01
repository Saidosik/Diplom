<?php

use App\Http\Controllers\Api\Publication\PublicationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SocialAuthController;

Route::get('/publications', [PublicationController::class, 'index']);

Route::get('/publications/{publication}', [PublicationController::class, 'show']);


Route::prefix('oauth')->group(function () {
    Route::get('/{provider}/redirect-url', [SocialAuthController::class, 'redirectUrl']);
    Route::get('/{provider}/callback', [SocialAuthController::class, 'callback']);
});
