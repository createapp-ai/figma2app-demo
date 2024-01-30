/* eslint-disable max-lines */
import type { Prisma } from '@prisma/client';
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import axios from 'axios';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { API_SIGN_IN_URL, API_SIGN_UP_PASSWORD_URL } from './constants';
import { lastNonAuthPathsAtom, userIdAtom } from './states';
import { saveMapOAuthToUserFct } from './storage';
import { supabase } from './supabase';
import { GitHubUser, GoogleUser, User } from './types';

function useAllowCurrentPathRedirect(allow = true) {
  const [lastNonAuthPaths, setLastNonAuthPaths] = useAtom(lastNonAuthPathsAtom);
  const location = useLocation();
  const screenPath = useRef(location.pathname);

  useEffect(() => {
    if (!allow && lastNonAuthPaths.includes(screenPath.current)) {
      setLastNonAuthPaths(
        lastNonAuthPaths.filter((path) => path !== screenPath.current)
      );
    }
  }, [allow, lastNonAuthPaths, setLastNonAuthPaths, screenPath.current]);
}

export function useRedirectBack() {
  const history = useHistory();
  const [lastNonAuthPaths, setLastNonAuthPaths] = useAtom(lastNonAuthPathsAtom);

  const targetPath = useRef('/');
  targetPath.current = lastNonAuthPaths[lastNonAuthPaths.length - 1] ?? '/';

  return function () {
    setLastNonAuthPaths([targetPath.current]); // We reset the history to the new target path
    history.replace(targetPath.current);
  };
}

export function useIsAuthed() {
  const [userId] = useAtom(userIdAtom);

  return userId.state === 'hasData';
}

/**
 * Creates a new user with an email and password or phone and password.
 */
export function useSignUpWithPassword({
  onWaitingForEmailVerification,
  allowRedirectionToThisPage = false,
}: {
  onWaitingForEmailVerification: () => void;
  allowRedirectionToThisPage?: boolean;
}) {
  useAllowCurrentPathRedirect(allowRedirectionToThisPage);

  const setUserId = useSetAtom(userIdAtom);

  return async function (
    credentials: SignUpWithPasswordCredentials,
    user: Omit<Prisma.UserCreateInput, 'authId'>
  ) {
    setUserId({ state: 'loading' });
    try {
      if ('email' in credentials && !credentials.options?.emailRedirectTo) {
        credentials.options = {
          ...credentials.options,
          emailRedirectTo: window.location.origin + window.location.pathname,
        };
      }

      await axios.post(API_SIGN_UP_PASSWORD_URL, {
        credentials,
        user,
      });
      onWaitingForEmailVerification();
      setUserId({ state: 'default' });
    } catch (error: unknown) {
      setUserId({
        state: 'hasError',
        error: (error as Error).message,
      });
      throw error;
    }
  };
}

/**
 * Log in an existing user with an email and password or phone and password.
 *
 * Be aware that you may get back an error message that will not distinguish
 * between the cases where the account does not exist or that the
 * email/phone and password combination is wrong or that the account can only
 * be accessed via social login.
 */
export function useSignInWithPassword({
  allowRedirectionToThisPage = false,
}: {
  allowRedirectionToThisPage?: boolean;
} = {}) {
  useAllowCurrentPathRedirect(allowRedirectionToThisPage);

  const setUserId = useSetAtom(userIdAtom);

  return async function (credentials: SignInWithPasswordCredentials) {
    setUserId({ state: 'loading' });
    try {
      const res = await supabase.auth.signInWithPassword(credentials);
      if (res.error) {
        throw res.error;
      }
      const { data } = await axios.get<User>(API_SIGN_IN_URL);
      setUserId({ state: 'hasData', data: data.authId });
    } catch (error: unknown) {
      setUserId({
        state: 'hasError',
        error: (error as Error).message,
      });
      throw error;
    }
  };
}

type Provider = 'github' | 'google';

type MapOAuthUser<T extends Provider> = T extends 'github'
  ? GitHubUser
  : GoogleUser;

type Exact<T, U> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof U]: K extends keyof T ? T[K] : never;
} & T;

export function useSignUpWithProvider<T extends Provider, U>({
  allowRedirectionToThisPage = false,
  provider,
  mapOAuthToUser,
}: {
  allowRedirectionToThisPage?: boolean;
  provider: T;
  mapOAuthToUser: (
    user: MapOAuthUser<T>
  ) => Exact<Omit<Prisma.UserCreateInput, 'authId'>, U>;
}) {
  useAllowCurrentPathRedirect(allowRedirectionToThisPage);

  const setUserId = useSetAtom(userIdAtom);

  return async function () {
    try {
      saveMapOAuthToUserFct(mapOAuthToUser);
      const res = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + window.location.pathname,
          skipBrowserRedirect: true,
        },
      });
      if (res.error) {
        throw res.error;
      }
      window.open(res.data.url, 'OAuthPopup', 'toolbar=no, menubar=no');
    } catch (error: unknown) {
      setUserId({
        state: 'hasError',
        error: (error as Error).message,
      });
      throw error;
    }
  };
}

export function useSignInWithProvider<T extends Provider>({
  allowRedirectionToThisPage = false,
  provider,
}: {
  allowRedirectionToThisPage?: boolean;
  provider: T;
}) {
  useAllowCurrentPathRedirect(allowRedirectionToThisPage);

  const setUserId = useSetAtom(userIdAtom);

  return async function () {
    try {
      const res = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + window.location.pathname,
          skipBrowserRedirect: true,
        },
      });
      if (res.error) {
        throw res.error;
      }
      window.open(res.data.url, 'OAuthPopup', 'toolbar=no, menubar=no');
    } catch (error: unknown) {
      setUserId({
        state: 'hasError',
        error: (error as Error).message,
      });
      throw error;
    }
  };
}

/**
 * Log in a user using magiclink or a one-time password (OTP).
 *
 * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
 * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
 * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
 *
 * Be aware that you may get back an error message that will not distinguish
 * between the cases where the account does not exist or, that the account
 * can only be accessed via social login.
 *
 * Do note that you will need to configure a Whatsapp sender on Twilio
 * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
 * channel is not supported on other providers
 * at this time.
 * This method supports PKCE when an email is passed.
 */
// export function signInWithOtp(
//   credentials: SignInWithPasswordlessCredentials
// ) {
//   const res = await supabase.auth.signInWithOtp(credentials);
//   if (res.error) {
//     throw res.error;
//   }
//   const { data } = await axios.get(API_SIGN_IN_URL);
//   return data;
// }

/**
 * `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
 */
export function useSignOut({
  allowRedirectionToThisPage = false,
}: {
  allowRedirectionToThisPage?: boolean;
} = {}) {
  useAllowCurrentPathRedirect(allowRedirectionToThisPage);

  const setUserId = useSetAtom(userIdAtom);

  return async function () {
    setUserId({ state: 'loading' });
    try {
      const res = await supabase.auth.signOut();
      if (res.error) {
        throw res.error;
      }
      setUserId({ state: 'default' });
    } catch (error: unknown) {
      setUserId({
        state: 'hasError',
        error: (error as Error).message,
      });
      throw error;
    }
  };
}

/**
 * Sends a password reset request to an email address. This method supports the PKCE flow.
 *
 * @param email The email address of the user.
 * @param redirectTo The URL to send the user to after they click the password reset link.
 */
export function useResetPassword({
  onWaitingForEmailPasswordUpdate,
  allowRedirectionToThisPage = false,
}: {
  onWaitingForEmailPasswordUpdate: () => void;
  allowRedirectionToThisPage?: boolean;
}) {
  useAllowCurrentPathRedirect(allowRedirectionToThisPage);

  const setUserId = useSetAtom(userIdAtom);

  return async function resetPassword(email: string) {
    setUserId({ state: 'loading' });
    try {
      const res = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname,
      });
      if (res.error) {
        throw res.error;
      }
      onWaitingForEmailPasswordUpdate();
      setUserId({ state: 'default' });
    } catch (error: unknown) {
      setUserId({
        state: 'hasError',
        error: (error as Error).message,
      });
      throw error;
    }
  };
}

export function useUpdatePassword({
  allowRedirectionToThisPage = false,
}: {
  allowRedirectionToThisPage?: boolean;
} = {}) {
  useAllowCurrentPathRedirect(allowRedirectionToThisPage);

  const setUserId = useSetAtom(userIdAtom);
  const redirectBack = useRedirectBack();

  return async function updatePassword(password: string) {
    setUserId({ state: 'loading' });

    try {
      const res = await supabase.auth.updateUser({ password });
      if (res.error) {
        throw res.error;
      }
      const { data } = await axios.get<User>(API_SIGN_IN_URL);
      setUserId({ state: 'hasData', data: data.authId });
      redirectBack();
    } catch (error: unknown) {
      setUserId({
        state: 'hasError',
        error: (error as Error).message,
      });
      throw error;
    }
  };
}

export function useUserId() {
  const [userId, setUserId] = useAtom(userIdAtom);

  return {
    userId,
    clearError: async () => {
      await supabase.auth.signOut();
      setUserId({ state: 'default' });
    },
  };
}
