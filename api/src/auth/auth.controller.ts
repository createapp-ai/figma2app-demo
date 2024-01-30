import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

import { PrismaService } from '~/prisma';

import { AuthedUser, OnlyAuthed } from './auth.decorator';
import { AuthService } from './auth.service';

class SignUpPasswordInputDto {
  @IsDefined()
  credentials: SignUpWithPasswordCredentials;

  @IsDefined()
  user: Omit<Prisma.UserCreateInput, 'authId'>;
}

class SignUpOAuthInputDto {
  @IsString()
  @IsNotEmpty()
  authId: string;

  @IsDefined()
  user: Omit<Prisma.UserCreateInput, 'authId'>;
}

@Controller('/_/auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private auth: AuthService,
  ) {}

  @OnlyAuthed()
  @Get('/signin')
  async signin(@AuthedUser() user: AuthedUser) {
    return user;
  }

  @Post('/signup/password')
  async signupPassword(@Body() { credentials, user }: SignUpPasswordInputDto) {
    return await this.auth.signUpWithPassword(credentials, user);
  }

  @Post('/signup/oauth')
  async signupOAuth(@Body() { authId, user }: SignUpOAuthInputDto) {
    return await this.prisma.user.create({
      data: { ...user, authId },
    });
  }
}
