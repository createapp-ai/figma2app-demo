import { Session, UserMetadata } from '@supabase/supabase-js';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { API_SIGN_IN_URL, API_SIGN_UP_OAUTH_URL } from './constants';
import { DebugSelectAuthId } from './debug';
import { useIsAuthed, useRedirectBack } from './hooks';
import { lastNonAuthPathsAtom, userIdAtom } from './states';
import { pullMapOAuthToUserFct } from './storage';
import { supabase } from './supabase';
import { User } from './types';

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const setLastNonAuthPaths = useSetAtom(lastNonAuthPathsAtom);
  const setUserId = useSetAtom(userIdAtom);
  const isAuthed = useIsAuthed();
  const location = useLocation();
  const redirectBack = useRedirectBack();

  async function onSignUpOAuthSucceed(authId: string, oAuthUser: UserMetadata) {
    const mapOAuthToUser = pullMapOAuthToUserFct();
    if (!mapOAuthToUser) {
      setUserId({
        state: 'hasError',
        error: 'Cannot sign in before signing up',
      });
      return;
    }

    try {
      const { data } = await axios.post<User>(API_SIGN_UP_OAUTH_URL, {
        authId,
        user: mapOAuthToUser(oAuthUser),
      });
      setUserId({ state: 'hasData', data: data.authId });
      redirectBack();
    } catch (error: unknown) {
      setUserId({
        state: 'hasError',
        error: (error as Error).message,
      });
    }
  }
  const onSignUpOAuthSucceedRef = useRef(onSignUpOAuthSucceed);
  onSignUpOAuthSucceedRef.current = onSignUpOAuthSucceed;

  const prevAccessTokenRef = useRef<string | null>(null);

  async function onSignIn(accessToken: string) {
    if (isAuthed && prevAccessTokenRef.current === accessToken) {
      redirectBack();
      return;
    }
    prevAccessTokenRef.current = accessToken;

    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`; // prettier-ignore
    setUserId({ state: 'silentlyLoading' });
    const { data } = await axios.get<User>(API_SIGN_IN_URL);
    setUserId({ state: 'hasData', data: data.authId });
    redirectBack();
  }
  const onSignInRef = useRef(onSignIn);
  onSignInRef.current = onSignIn;

  async function onInitialSession(session: Session | null) {
    if (!session?.access_token) {
      setUserId({
        state: 'silentlyHasError',
        error: 'No access token',
      });
      return;
    }

    const user = session.user;
    const providers = [
      ...(user.app_metadata.providers ?? []),
      user.user_metadata.provider,
    ].filter((p?: string) => p !== 'email');
    const isOAuth = providers.length > 0;

    try {
      await onSignInRef.current(session?.access_token);
    } catch (error: unknown) {
      if (isOAuth) {
        await onSignUpOAuthSucceedRef.current(user.id, user.user_metadata);
      } else {
        supabase.auth.signOut();
        setUserId({
          state: 'silentlyHasError',
          error: (error as Error).message,
        });
      }
    }
  }
  const onInitialSessionRef = useRef(onInitialSession);
  onInitialSessionRef.current = onInitialSession;

  function onSignOut() {
    setUserId({ state: 'default' });
  }
  const onSignOutRef = useRef(onSignOut);
  onSignOutRef.current = onSignOut;

  const isAuthedRef = useRef(isAuthed);
  isAuthedRef.current = isAuthed;

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        switch (event) {
          case 'INITIAL_SESSION':
            await onInitialSessionRef.current(session);
            break;
          case 'SIGNED_IN':
            await onSignInRef.current(session!.access_token);
            break;
          case 'SIGNED_OUT':
            onSignOutRef.current();
            break;
        }
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setLastNonAuthPaths((lastNonAuthPaths) =>
      lastNonAuthPaths[lastNonAuthPaths.length - 1] === location.pathname
        ? lastNonAuthPaths
        : [...lastNonAuthPaths, location.pathname]
    );
  }, [location.pathname, setLastNonAuthPaths]);

  return (
    <>
      {children}
      {import.meta.env.DEV && <DebugSelectAuthId />}
    </>
  );
}
