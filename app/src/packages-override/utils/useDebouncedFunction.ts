import _ from 'lodash';
import { useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Args = any[];

type Fct<U extends Args> = (...args: U) => void;

interface Call<T extends Fct<U>, U extends Args> {
  args: U;
  fct: T;
}

const getOrCreateNextCalls = _.memoize(
  (_id: string) => ({} as { [key: string]: Call<Fct<Args>, Args> })
);
const getOrCreateTimeouts = _.memoize(
  (_id: string) => ({} as { [key: string]: NodeJS.Timeout })
);

export function useDebouncedFunction<T extends Fct<U>, U extends Args>(
  fct: T,
  wait: number,
  id: string
): T {
  const nextCalls = getOrCreateNextCalls(id);
  const timeouts = getOrCreateTimeouts(id);

  function delayedQueueFunction(...args: U) {
    const execute = () => {
      if (nextCalls[id]) {
        const { args, fct } = nextCalls[id];
        delete nextCalls[id];
        timeouts[id] = setTimeout(() => execute(), wait);
        // @ts-expect-error - untyped this
        fct.apply(this, args);
      } else {
        delete timeouts[id];
      }
    };

    nextCalls[id] = { args: args, fct: fct as unknown as Fct<Args> };

    if (!timeouts[id]) {
      execute();
      timeouts[id] = setTimeout(() => execute(), wait);
    }
  }

  const delayedQueueFunctionRef = useRef(delayedQueueFunction);

  return delayedQueueFunctionRef.current as unknown as T;
}
