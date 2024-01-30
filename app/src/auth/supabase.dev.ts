/* eslint-disable max-lines */

import {
  AuthChangeEvent,
  AuthError,
  Session,
  User,
} from '@supabase/supabase-js';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import { jwtVerify, SignJWT } from 'jose';

import { getSelectedAuthId } from './debug';
import { hasMapOAuthToUserFct } from './storage';
import { GitHubUser, GoogleUser } from './types';

export function createSupabaseClient(supabaseJWTSecret: string): {
  auth: Pick<
    SupabaseAuthClient,
    | 'signOut'
    | 'onAuthStateChange'
    | 'signInWithPassword'
    | 'signInWithOAuth'
    | 'resetPasswordForEmail'
    | 'updateUser'
  >;
} {
  let loadedSession = false;

  const eventCallbacks: Array<
    (event: AuthChangeEvent, session: Session | null) => void
  > = [];
  const secret = new TextEncoder().encode(supabaseJWTSecret);

  function emitAuthEvent(event: AuthChangeEvent, session: Session | null) {
    for (const callback of eventCallbacks) {
      callback(event, session);
    }
  }

  async function loadSessionIfNeeded() {
    if (loadedSession) {
      return;
    }
    loadedSession = true;

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return emitAuthEvent('INITIAL_SESSION', null);
    }
    try {
      const { payload } = await jwtVerify(jwt, secret);
      return emitAuthEvent('INITIAL_SESSION', {
        access_token: jwt,
        expires_in: -1,
        refresh_token: '',
        token_type: '',
        user: payload as unknown as User,
      });
    } catch (error: unknown) {
      return emitAuthEvent('INITIAL_SESSION', null);
    }
  }

  const signInWithPassword: Pick<
    SupabaseAuthClient,
    'signInWithPassword'
  >['signInWithPassword'] = async function (credentials) {
    const authId = await getSelectedAuthId();

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

    try {
      const jwt = await new SignJWT({ ...user })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(authId)
        .sign(secret);

      localStorage.setItem('jwt', jwt);

      const session: Session = {
        access_token: jwt,
        expires_in: -1,
        refresh_token: '',
        token_type: '',
        user,
      };

      emitAuthEvent('SIGNED_IN', session);
      return { error: null, data: { user, session } };
    } catch (error: unknown) {
      return {
        error: new AuthError("Couldn't sign in"),
        data: { user: null, session: null },
      };
    }
  };

  const signOut: Pick<SupabaseAuthClient, 'signOut'>['signOut'] =
    async function () {
      localStorage.removeItem('jwt');
      emitAuthEvent('SIGNED_OUT', null);
      return { error: null };
    };

  const signInWithOAuth: Pick<
    SupabaseAuthClient,
    'signInWithOAuth'
  >['signInWithOAuth'] = async function ({ provider }) {
    const ids = crypto.randomUUID().split('-');
    const authId = `${ids[ids.length - 1]}.${provider}`;
    const email = `${authId}@mock.dev`;

    const user: User = {
      app_metadata: {
        provider: provider,
      },
      aud: '',
      confirmed_at: '',
      created_at: '',
      email: email,
      id: email,
      last_sign_in_at: '',
      phone: '',
      role: '',
      updated_at: '',
      user_metadata:
        provider === 'github'
          ? ({
              avatar_url: 'https://avatars.githubusercontent.com/u/0?v=0',
              email,
              email_verified: true,
              full_name: `Mock ${provider} User`,
              name: `Mock ${provider} User`,
              phone_verified: false,
              preferred_username: `mock-${provider}-user`,
              user_name: `mock-${provider}-user`,
            } as GitHubUser)
          : ({
              avatar_url:
                'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
              email,
              email_verified: true,
              full_name: `Mock ${provider} User`,
              name: `Mock ${provider} User`,
              phone_verified: false,
              picture:
                'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
            } as GoogleUser),
    };

    const sub = hasMapOAuthToUserFct() ? authId : await getSelectedAuthId();
    const jwt = await new SignJWT({ ...user })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(sub)
      .sign(secret);

    localStorage.setItem('jwt', jwt);

    const session = {
      access_token: jwt,
      expires_in: -1,
      refresh_token: '',
      token_type: '',
      user,
    };

    window.location.reload();
    return { error: null, data: { user, session, url: '', provider } };
  };

  const resetPasswordForEmail: Pick<
    SupabaseAuthClient,
    'resetPasswordForEmail'
  >['resetPasswordForEmail'] = async function (email, { redirectTo } = {}) {
    localStorage.removeItem('jwt');
    await signInWithPassword({ email, password: '' });
    if (redirectTo) {
      window.history.replaceState(null, '', redirectTo);
    }
    return { error: null, data: {} };
  };

  const updateUser: Pick<SupabaseAuthClient, 'updateUser'>['updateUser'] =
    async function (userData) {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        return {
          error: new AuthError("Couldn't update user"),
          data: { user: null },
        };
      }
      const { payload } = await jwtVerify(jwt, secret);
      const user = payload as unknown as User;
      return { error: null, data: { user: { ...user, ...userData } as User } };
    };

  const onAuthStateChange: Pick<
    SupabaseAuthClient,
    'onAuthStateChange'
  >['onAuthStateChange'] = function (callback) {
    eventCallbacks.push(callback);
    loadSessionIfNeeded(); // Async load session
    return {
      data: {
        subscription: {
          id: '',
          callback,
          unsubscribe() {
            const index = eventCallbacks.indexOf(callback);
            if (index !== -1) {
              eventCallbacks.splice(index, 1);
            }
          },
        },
      },
    };
  };

  return {
    auth: {
      signInWithPassword,
      signOut,
      signInWithOAuth,
      resetPasswordForEmail,
      updateUser,
      onAuthStateChange,
    },
  };
}
