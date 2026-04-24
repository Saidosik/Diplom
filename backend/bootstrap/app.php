<?php

use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\GuestMiddleware;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Middleware\RefreshMiddleware;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'jwt' => JwtMiddleware::class,
            'admin' => EnsureUserIsAdmin::class,
            'guest' => GuestMiddleware::class,
            'role' => RoleMiddleware::class,
            'refresh' => RefreshMiddleware::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
