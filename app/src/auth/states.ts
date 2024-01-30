import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

type Lodable<Value> =
  | {
      state: 'default';
    }
  | {
      state: 'silentlyLoading';
    }
  | {
      state: 'loading';
    }
  | {
      state: 'hasError';
      error: string;
    }
  | {
      state: 'silentlyHasError';
      error: string;
    }
  | {
      state: 'hasData';
      data: Value;
    };

export const userIdAtom = atom<Lodable<string>>({
  state: 'default',
});

export const lastNonAuthPathsAtom = atomWithStorage<string[]>(
  'lastNonAuthPaths',
  []
);
