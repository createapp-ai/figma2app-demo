import { IonActionSheet } from '@ionic/react';
import { Provider, useAtom, useSetAtom } from 'jotai';

import { authIdsAtom, selectedAuthIdAtom, store } from './states';

function DebugSelectAuthId() {
  const [authIds, setAuthIds] = useAtom(authIdsAtom);
  const setSelectAuthId = useSetAtom(selectedAuthIdAtom);

  return (
    <IonActionSheet
      isOpen={authIds.state !== 'default'}
      header={
        authIds.state === 'loading'
          ? 'Loading users...'
          : authIds.state === 'hasData'
          ? 'Select the user to sign in'
          : 'Failed to load users 😥'
      }
      onWillDismiss={() => {
        setAuthIds({ state: 'default' });
        setSelectAuthId({ state: 'hasError', error: 'No user selected' });
      }}
      buttons={[
        ...(authIds.state === 'hasData'
          ? authIds.data.map((authId) => ({
              text: authId,
              handler: () =>
                setSelectAuthId({ state: 'hasData', data: authId }),
            }))
          : []),
        {
          text: 'Raise error (for testing)',
          role: 'destructive',
          handler: () =>
            setSelectAuthId({
              state: 'hasError',
              error: 'Mock authentification error',
            }),
        },
      ]}
    />
  );
}

export default function () {
  return (
    <Provider store={store}>
      <DebugSelectAuthId />
    </Provider>
  );
}
