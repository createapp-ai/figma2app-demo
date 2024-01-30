import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useIsAuthed } from '~/auth';
import { createAxios } from '~/axios';

import { availableStatesAtom, selectedStateAtom } from '../states';

const axios = createAxios('/home/location-selection');

export const useLocationSelection = () => {
  const [availableStates, setAvailableStates] = useAtom(availableStatesAtom);
  const [_, setSelectedState] = useAtom(selectedStateAtom);
  const isAuthed = useIsAuthed();
  const history = useHistory();

  async function fetchStates() {
    try {
      const { data } = await axios.get<{ states: string[] }>('/states');
      setAvailableStates({ state: 'hasData', data: data.states });
    } catch (e) {
      setAvailableStates({ state: 'hasError', error: (e as Error).message });
    }
  }

  async function selectState(state: string) {
    try {
      setSelectedState({ state: 'hasData', data: state });
      await axios.post<{ selectedState: string }>('/selectedState', { state });
    } catch (e) {
      setSelectedState({ state: 'hasError', error: (e as Error).message });
    }
  }

  useEffect(() => {
    if (!isAuthed) {
      history.replace('/sign-in');
    } else {
      fetchStates();
    }
  }, [isAuthed, history]);

  return {
    availableStates,
    selectState,
  };
};
