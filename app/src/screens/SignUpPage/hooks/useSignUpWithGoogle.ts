import { useSignUpWithProvider } from '~/auth';

export const useSignUpWithGoogle = () => {
  const signUpWithProvider = useSignUpWithProvider({
    provider: 'google',
    mapOAuthToUser: (oauth) => ({
      email: oauth.email,
      name: oauth.full_name,
      avatarUrl: oauth.avatar_url,
    }),
  });

  return {
    signUpWithGoogle: signUpWithProvider,
  };
};
