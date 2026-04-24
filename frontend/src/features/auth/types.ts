export type User = {
  id: number;
  name: string;
  email: string;
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

export type AuthMeResponse = {
  user: User;
};