<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $providers = $this->whenLoaded('socialAccounts', function () {
            return $this->socialAccounts
                ->pluck('provider')
                ->unique()
                ->values()
                ->all();
        }, []);

        $registeredVia = count($providers) > 0
            ? (count($providers) === 1 ? $providers[0] : $providers)
            : 'email/password';

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'avatar_url' => $this->avatarUrl(),
            'role' => $this->role,

            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'is_email_verified' => $this->hasVerifiedEmail(),

            'registered_via' => $registeredVia,
            'auth_providers' => count($providers) > 0 ? $providers : ['email/password'],

            'social_accounts' => $this->whenLoaded('socialAccounts', function () {
                return $this->socialAccounts->map(fn($account) => [
                    'id' => $account->id,
                    'provider' => $account->provider,
                    'email' => $account->email,
                    'name' => $account->name,
                    'avatar' => $account->avatar,
                    'created_at' => $account->created_at?->toISOString(),
                ])->values();
            }),

            'meta' => [
                'isAdmin' => $this->isAdmin(),
            ],

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    private function avatarUrl(): ?string
    {
        if (! $this->avatar) {
            return null;
        }

        if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
            return $this->avatar;
        }

        return Storage::url($this->avatar);
    }
}
