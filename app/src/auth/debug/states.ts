import { atom, createStore } from 'jotai';

type Lodable<Value> =
  | {
      state: 'default';
    }
  | {
      state: 'loading';
    }
  | {
      state: 'hasError';
      error: string;
    }
  | {
      state: 'hasData';
      data: Value;
    };

export const authIdsAtom = atom<Lodable<string[]>>({
  state: 'default',
});

export const selectedAuthIdAtom = atom<Lodable<string>>({
  state: 'default',
});

export const store = createStore();
