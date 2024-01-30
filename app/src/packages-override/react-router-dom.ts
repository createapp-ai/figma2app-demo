import { useHistory as _useHistory } from '_react-router-dom';
import { useMemo } from 'react';

import { useDebouncedFunction } from './utils';

/**
 * Custom hook that wraps the `useHistory` hook from `react-router-dom` and provides debounced navigation actions.
 * Debouncing the navigation actions helps prevent crashes in `react-router-dom` when multiple instantaneous redirections are triggered.
 *
 * @returns An object containing the router object, debounced `push` function, and debounced `goBack` function.
 */
export function useHistory() {
  const WAIT_BETWEEN = 200; // ms

  const history = _useHistory();

  const push = useDebouncedFunction(
    history.push,
    WAIT_BETWEEN,
    'react-router-dom.history'
  );
  const goBack = useDebouncedFunction(
    history.goBack,
    WAIT_BETWEEN,
    'react-router-dom.history'
  );
  const goForward = useDebouncedFunction(
    history.goForward,
    WAIT_BETWEEN,
    'react-router-dom.history'
  );
  const go = useDebouncedFunction(
    history.go,
    WAIT_BETWEEN,
    'react-router-dom.history'
  );
  const replace = useDebouncedFunction(
    history.replace,
    WAIT_BETWEEN,
    'react-router-dom.history'
  );

  const overriddenHistory = useMemo(() => {
    return { ...history, push, goBack, goForward, go, replace };
  }, [history, push, goBack, goForward, go, replace]);

  return overriddenHistory;
}

export * from '_react-router-dom';
