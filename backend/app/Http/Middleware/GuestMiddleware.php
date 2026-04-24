<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Throwable;
class GuestMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Если токена вообще нет — это гость
        if (! $request->bearerToken()) {
            return $next($request);
        }

        try {
            $user = JWTAuth::parseToken()->authenticate();

            if ($user) {
                return response()->json([
                    'error' => 'Уже авторизован',
                ], 403);
            }
        } catch (TokenExpiredException|TokenInvalidException|TokenBlacklistedException|JWTException $e) {
            // Для guest-маршрута это значит просто "не авторизован"
            return $next($request);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'error' => 'Ошибка при проверке авторизации',
            ], 500);
        }

        return $next($request);
    }
}
