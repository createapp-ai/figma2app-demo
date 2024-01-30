import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useIsAuthed } from '~/auth';
import { createAxios } from '~/axios';

import { eventsAtom, selectedStateAtom, upcomingEventsAtom } from '../states';
import { Event, UpcomingEvent } from '../types';

const axios = createAxios('/home/load-data');

export const useLoadData = () => {
  const history = useHistory();
  const [selectedState, setSelectedState] = useAtom(selectedStateAtom);
  const [events, setEvents] = useAtom(eventsAtom);
  const [upcomingEvents, setUpcomingEvents] = useAtom(upcomingEventsAtom);
  const isAuthed = useIsAuthed();

  async function fetchSelectedState() {
    setSelectedState({ state: 'loading' });
    try {
      const { data } = await axios.get<{ state: string }>('/current-location');
      setSelectedState({ state: 'hasData', data: data.state });
    } catch (e) {
      setSelectedState({ state: 'hasError', error: (e as Error).message });
      setEvents({ state: 'hasError', error: "Can't load events" });
      setUpcomingEvents({ state: 'hasError', error: "Can't load events" });
    }
  }

  async function fetchData(state: string) {
    setUpcomingEvents({ state: 'loading' });
    setEvents({ state: 'loading' });
    try {
      const { data: eventsData } = await axios.get<Event[]>(
        `/events?state=${state}`
      );
      setEvents({ state: 'hasData', data: eventsData });

      const { data: upcomingEventsData } = await axios.get<UpcomingEvent[]>(
        '/upcoming-events?limit=3'
      );
      setUpcomingEvents({ state: 'hasData', data: upcomingEventsData });
    } catch (error) {
      setEvents({ state: 'hasError', error: (error as Error).message });
      setUpcomingEvents({
        state: 'hasError',
        error: (error as Error).message,
      });
    }
  }

  useEffect(() => {
    if (!isAuthed) {
      history.replace('/sign-in');
    } else if (selectedState.state === 'default') {
      fetchSelectedState();
    } else if (selectedState.state === 'hasData') {
      fetchData(selectedState.data);
    }
  }, [isAuthed, selectedState]);

  return { selectedState, events, upcomingEvents };
};
