// export type UserRole = 'user' | 'admin' | string;
export type AuthSlug = 'login' | 'register'
export type SocialAccount = {
  id: number;
  provider: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  created_at: string | null;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role?: "user" | "admin" | "moderator" | string;
  avatar?: string | null;
  avatar_url?: string | null;
  email_verified_at?: string | null;
  is_email_verified?: boolean;
  registered_via?: string | string[];
  auth_providers?: string[];
  social_accounts?: SocialAccount[];
  created_at?: string | null;
  updated_at?: string | null;
  meta?: {
    isAdmin?: boolean;
  };
};

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

// export type UpdateProfileDto = {
//   name?: string;
//   email?: string;
//   password?: string;
//   password_confirmation?: string;
// };

export type AuthMeResponse = {
  user: User;
};


export type AllowedAuthProviders = 'yandex' | 'google' 

export type AuthProviders = AllowedAuthProviders[] 