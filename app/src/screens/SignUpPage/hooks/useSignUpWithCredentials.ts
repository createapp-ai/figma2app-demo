import { useAtom } from 'jotai';

import { useSignUpWithPassword, useUserId } from '~/auth';

import {
  confirmPasswordAtom,
  emailAtom,
  errorAtom,
  fullNameAtom,
  modalAtom,
  passwordAtom,
} from '../states';

export const useSignUpWithCredentials = () => {
  const [fullName, setFullName] = useAtom(fullNameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [confirmPassword, setConfirmPassword] = useAtom(confirmPasswordAtom);
  const [error, setError] = useAtom(errorAtom);
  const [modal, setModal] = useAtom(modalAtom);
  const signUpWithPassword = useSignUpWithPassword({
    onWaitingForEmailVerification: () => {
      setModal('Please check your email to verify your account');
    },
  });
  const { clearError, userId } = useUserId();

  async function signUpWithCredentials() {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!fullName) {
      setError('Please enter your full name');
      return;
    }

    try {
      await signUpWithPassword(
        {
          email,
          password,
        },
        {
          email,
          name: fullName,
        }
      );
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return {
    fullName: { value: fullName, set: setFullName },
    email: { value: email, set: setEmail },
    password: { value: password, set: setPassword },
    confirmPassword: { value: confirmPassword, set: setConfirmPassword },
    error,
    modal,
    state: userId.state,
    setModal,
    signUpWithCredentials,
    clearError: () => {
      clearError();
      setError('');
    },
  };
};
