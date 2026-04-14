<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    
    public function register(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' =>  $request->email,
            'password' => $request->password
        ]);
        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    public function login(Request $request){
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token', 'e' => $e], 500);
        }

        return response()->json([
            'token' => $token,
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
        ]);
    }

    public function logout(){
        try{
            JWTAuth::invalidate(JWTAuth::getToken());
        }catch(JWTException $e){
            return response()->json([
                'error' => 'Ошибка при выходе из системы'
            ], 500);
        }
        return response()->json([
            'message' => 'Успешный выход из аккаунта'
        ]);
    }

    public function me(Request $request){
        return response()->json([
            "request" => $request->all(),
            "user"=> $request->user()
        ]);
    }

    public function refresh(){
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());
            return response()->json([
                'token' => $token,
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
            ]);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not refresh token'], 500);
        }
    }
    
    // public function updateUser(Request $request)
    // {
    //     try {
    //         $user = Auth::user();
    //         $user->update($request->only(['name', 'email']));
    //         return response()->json($user);
    //     } catch (JWTException $e) {
    //         return response()->json(['error' => 'Failed to update user' , 'e' => $e], 500);
    //     }
    // }

}

