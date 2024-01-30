import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import {
  createClient,
  SignUpWithPasswordCredentials,
  SupabaseClient,
} from '@supabase/supabase-js';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

import { Database } from './supabase.types';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  private clientInstance: SupabaseClient;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
  ) {}

  private async connect() {
    if (this.clientInstance) {
      return this.clientInstance;
    }

    const SUPABASE_API_URL = this.configService.get('SUPABASE_API_URL');
    const SUPABASE_ANON_KEY = this.configService.get('SUPABASE_ANON_KEY');
    if (!SUPABASE_API_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing SUPABASE_API_URL or SUPABASE_ANON_KEY');
    }

    const client = createClient<Database>(SUPABASE_API_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${ExtractJwt.fromAuthHeaderAsBearerToken()(
            this.request,
          )}`,
        },
      },
    });
    if (!client) {
      throw new Error('Failed to create Supabase client');
    }

    this.clientInstance = client;
    return this.clientInstance;
  }

  async signUpWithPassword(credentials: SignUpWithPasswordCredentials) {
    const client = await this.connect();
    const res = await client.auth.signUp(credentials);
    if (res.error) {
      throw new UnauthorizedException(res.error.message);
    }
    if (!res.data.user) {
      throw new UnauthorizedException('Unknown error');
    }
    return res.data.user;
  }
}
