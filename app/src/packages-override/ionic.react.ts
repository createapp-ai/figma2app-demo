import { useIonRouter as _useIonRouter } from '_@ionic/react';
import { useMemo } from 'react';

import { useDebouncedFunction } from './utils';

/**
 * Custom hook that wraps the `useIonRouter` hook from `@ionic/react` and provides debounced navigation actions.
 * Debouncing the navigation actions helps prevent crashes in `react-router-dom` when multiple instantaneous redirections are triggered.
 *
 * @returns An object containing the router object, debounced `push` function, and debounced `goBack` function.
 */
export function useIonRouter() {
  const WAIT_BETWEEN = 50; // ms

  const router = _useIonRouter();

  const push = useDebouncedFunction(
    router.push,
    WAIT_BETWEEN,
    'ionic.router.push'
  );
  const goBack = useDebouncedFunction(
    router.goBack,
    WAIT_BETWEEN,
    'ionic.router.goBack'
  );

  const overriddenRouter = useMemo(() => {
    return { ...router, push, goBack };
  }, [router, push, goBack]);

  return overriddenRouter;
}

export * from '_@ionic/react';
