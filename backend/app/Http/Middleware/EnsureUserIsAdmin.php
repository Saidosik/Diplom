<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Не авторизован',
            ], 401);
        }

        if (! $user->isAdmin()) {
            return response()->json([
                'message' => 'Доступ запрещён',
            ], 403);
        }

        return $next($request);
    }
}