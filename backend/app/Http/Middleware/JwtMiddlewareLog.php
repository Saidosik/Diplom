<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $bearerToken = $request->bearerToken();
        $authorizationHeader = $request->header('Authorization');

        Log::debug('[JwtMiddleware] incoming request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'has_authorization_header' => $request->headers->has('Authorization'),
            'authorization_start' => $authorizationHeader ? substr($authorizationHeader, 0, 30) : null,
            'has_bearer_token' => $bearerToken !== null,
            'bearer_length' => $bearerToken ? strlen($bearerToken) : 0,
            'bearer_start' => $bearerToken ? substr($bearerToken, 0, 20) : null,
            'bearer_end' => $bearerToken ? substr($bearerToken, -20) : null,
        ]);

        try {
            if (! $bearerToken) {
                Log::warning('[JwtMiddleware] token not found');

                return response()->json([
                    'error' => 'токен не найден',
                ], 401);
            }

            /**
             * Проверяем, может ли Laravel хотя бы прочитать payload.
             * Если здесь упадёт TokenInvalidException — проблема в подписи/секрете/формате токена.
             */
            try {
                $payload = JWTAuth::setToken($bearerToken)->getPayload();

                Log::debug('[JwtMiddleware] payload parsed', [
                    'payload_sub' => $payload->get('sub'),
                    'payload_iat' => $payload->get('iat'),
                    'payload_exp' => $payload->get('exp'),
                    'payload_iss' => $payload->get('iss'),
                ]);
            } catch (\Throwable $payloadException) {
                Log::error('[JwtMiddleware] payload parse failed', [
                    'exception_class' => get_class($payloadException),
                    'message' => $payloadException->getMessage(),
                    'bearer_length' => strlen($bearerToken),
                    'bearer_start' => substr($bearerToken, 0, 20),
                    'bearer_end' => substr($bearerToken, -20),
                ]);

                throw $payloadException;
            }

            $user = JWTAuth::setToken($bearerToken)->authenticate();

            Log::debug('[JwtMiddleware] user authenticated', [
                'user_id' => $user?->id,
                'user_email' => $user?->email,
            ]);
        } catch (TokenExpiredException $e) {
            Log::warning('[JwtMiddleware] token expired', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'токен истек',
            ], 401);
        } catch (TokenInvalidException $e) {
            Log::warning('[JwtMiddleware] token invalid', [
                'message' => $e->getMessage(),
                'bearer_length' => $bearerToken ? strlen($bearerToken) : 0,
                'bearer_start' => $bearerToken ? substr($bearerToken, 0, 20) : null,
                'bearer_end' => $bearerToken ? substr($bearerToken, -20) : null,
            ]);

            return response()->json([
                'error' => 'токен некорректен',
            ], 401);
        } catch (TokenBlacklistedException $e) {
            Log::warning('[JwtMiddleware] token blacklisted', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'токен отозван',
            ], 401);
        } catch (JWTException $e) {
            Log::warning('[JwtMiddleware] jwt exception', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'токен не найден',
            ], 401);
        }

        if (! $user) {
            Log::warning('[JwtMiddleware] user not found after token authentication');

            return response()->json([
                'error' => 'не авторизован',
            ], 401);
        }

        auth('api')->setUser($user);
        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
