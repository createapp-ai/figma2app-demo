import axios from 'axios';

import { authIdsAtom, selectedAuthIdAtom, store } from './states';

async function loadAuthIds() {
  store.set(authIdsAtom, { state: 'loading' });
  try {
    const { data } = await axios.get<string[]>('/_/debug/auth-ids');
    store.set(authIdsAtom, { state: 'hasData', data });
  } catch (error: unknown) {
    store.set(authIdsAtom, {
      state: 'hasError',
      error: (error as Error).message,
    });
  }
}

export async function getSelectedAuthId() {
  return new Promise<string>((resolve, reject) => {
    store.set(selectedAuthIdAtom, { state: 'loading' });
    loadAuthIds();
    store.sub(selectedAuthIdAtom, async () => {
      const selectedAuthId = store.get(selectedAuthIdAtom);
      switch (selectedAuthId.state) {
        case 'hasData':
          resolve(selectedAuthId.data);
          break;
        case 'hasError':
          reject(new Error(selectedAuthId.error));
          break;
      }
    });
  });
}
