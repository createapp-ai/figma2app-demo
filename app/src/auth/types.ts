import type { User as _User } from '@prisma/client';

export type GitHubUser = {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  name: string;
  phone_verified: boolean;
  preferred_username: string;
  user_name: string;
};

export type GoogleUser = {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  name: string;
  phone_verified: boolean;
  picture: string;
};

export type User = _User;
