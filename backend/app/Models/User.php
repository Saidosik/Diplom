<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Attribute;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'email', 'password', 'role', 'avatar'])]
#[Hidden(['password', 'remember_token', 'role'])]

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'created_at'=>'datetime',
            'updated_at'=>'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function isAdmin()
    {
        if($this->role === 'admin'){
            return true;
        }else{
            return false;
        }
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function solutions() : HasMany
    {
        return $this->hasMany(Solution::class);
    }

    public function progress() : HasMany
    {
        return $this->hasMany(Progress::class);
    }

    public function comments() : HasMany
    {
        return $this->HasMany(Comment::class, 'commentable');
    }

    public function testAttempts(): HasMany
    {
        return $this->hasMany(TestAttempt::class);
    }
}
