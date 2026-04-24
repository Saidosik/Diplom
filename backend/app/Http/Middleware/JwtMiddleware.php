<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (TokenExpiredException $e) {
            return response()->json([
                'error' => 'токен истек',
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'error' => 'токен некорректен',
            ], 401);
        } catch (TokenBlacklistedException $e) {
            return response()->json([
                'error' => 'токен отозван',
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'error' => 'токен не найден',
            ], 401);
        }

        if (! $user) {
            return response()->json([
                'error' => 'Не авторизован',
            ], 401);
        }

        auth('api')->setUser($user);
        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
