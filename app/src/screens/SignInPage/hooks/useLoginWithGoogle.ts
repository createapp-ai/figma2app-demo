import { useSignUpWithProvider } from '~/auth';

export const useLoginWithGoogle = () => {
  const signInWithProvider = useSignUpWithProvider({
    provider: 'google',
    mapOAuthToUser: (oauth) => ({
      email: oauth.email,
      name: oauth.full_name,
      avatarUrl: oauth.avatar_url,
    }),
  });

  return { signInWithGoogle: signInWithProvider };
};
