import { useAtom } from 'jotai';

import { useSignInWithPassword, useUserId } from '~/auth';

import { emailAtom, passwordAtom } from '../states';

export const useSignInWithCredentials = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const signInWithPassword = useSignInWithPassword();
  const { userId, clearError } = useUserId();

  async function signInWithCredentials() {
    try {
      await signInWithPassword({
        email,
        password,
      });
    } catch (error) {}
  }

  return {
    signInWithCredentials,
    authState: userId.state,
    authError: userId.state === 'hasError' ? userId.error : undefined,
    clearError,
    email: { set: setEmail, value: email },
    password: { set: setPassword, value: password },
  };
};
