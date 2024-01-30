import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { usePrevious } from '@uidotdev/usehooks';

import { useIsAuthed } from '~/auth';
import { createAxios } from '~/axios';

import { eventAtom, ticketAtom } from '../states';
import { Event } from '../types';

const axios = createAxios('/event-details/load-data');

export const useLoadData = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useAtom(eventAtom);
  const [ticket] = useAtom(ticketAtom);
  const isAuthed = useIsAuthed();
  const history = useHistory();

  const ticketState = ticket.state;
  const prevTicketState = usePrevious(ticketState);

  async function fetchEventDetails() {
    setEvent({ state: 'loading' });
    try {
      const { data } = await axios.get<Event>(`/events/${id}`);
      setEvent({
        state: 'hasData',
        data,
      });
    } catch (error) {
      console.error(error);
      setEvent({
        state: 'hasError',
        error: (error as Error).message,
      });
    }
  }

  useEffect(() => {
    if (event.state === 'hasError') {
      history.replace('/');
    }
  }, [event.state, history]);

  useEffect(() => {
    if (ticketState === 'hasData' && prevTicketState === 'loading') {
      fetchEventDetails();
    }
  }, [ticketState, prevTicketState]);

  useEffect(() => {
    if (!isAuthed) {
      history.replace('/sign-in');
    } else {
      fetchEventDetails();
    }

    return () => {
      setEvent({ state: 'default' });
    };
  }, [id, setEvent]);

  return { event };
};
