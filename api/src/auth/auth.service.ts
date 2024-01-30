import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { SignUpWithPasswordCredentials } from '@supabase/supabase-js';

import { PrismaService } from '~/prisma';
import { SupabaseService } from '~/supabase';

@Injectable()
export class AuthService {
  constructor(
    private supabase: SupabaseService,
    private prisma: PrismaService,
  ) {}

  private async createUser(user: Prisma.UserCreateInput) {
    try {
      const newUser = await this.prisma.user.create({ data: user });
      return newUser;
    } catch (err) {
      console.error(err);
      if (err.code === 'P2002') {
        throw new UnauthorizedException('User already exists');
      }
      throw new UnauthorizedException("Couldn't create user");
    }
  }

  /**
   * Create a new user with email (or phone number) and password.
   *
   * @param credentials The credentials to sign up with (email+password or phone+password)
   * @param user The user to create
   * @returns The newly created user
   */
  async signUpWithPassword(
    credentials: SignUpWithPasswordCredentials,
    user: Omit<Prisma.UserCreateInput, 'authId'>,
  ) {
    const { id } = await this.supabase.signUpWithPassword(credentials);
    return this.createUser({ ...user, authId: id });
  }
}
