<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class RefreshMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(! $request->bearerToken()){
            return response()->json([
                'error' => 'Не авторизован',
            ], 401);
        }

        try{
            $user = JWTAuth::parseToken()->authenticate();
        } catch(TokenExpiredException $e){
            return $next($request);
        } catch (TokenInvalidException|TokenBlacklistedException|JWTException $e) {
            return response()->json([
                'message' => 'Токен недействителен',
            ], 401);
        }
        
        return $next($request);
    }
}