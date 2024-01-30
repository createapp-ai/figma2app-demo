import { Injectable, Scope } from '@nestjs/common';
import { SignUpWithPasswordCredentials, User } from '@supabase/supabase-js';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  constructor() {}

  async signUpWithPassword(credentials: SignUpWithPasswordCredentials) {
    const authId =
      'email' in credentials ? credentials.email : credentials.phone;

    const user: User = {
      app_metadata: {
        provider: 'email' in credentials ? 'email' : 'phone',
      },
      aud: '',
      confirmed_at: '',
      created_at: '',
      email: 'email' in credentials ? credentials.email : '',
      id: authId,
      last_sign_in_at: '',
      phone: 'phone' in credentials ? credentials.phone : '',
      role: '',
      updated_at: '',
      user_metadata: {},
    };
    return user;
  }
}
