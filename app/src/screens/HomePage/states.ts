import { atom } from 'jotai';

import { Event, Lodable, UpcomingEvent } from './types';

export const upcomingEventsAtom = atom<Lodable<UpcomingEvent[]>>({
  state: 'default',
});

export const eventsAtom = atom<Lodable<Event[]>>({ state: 'default' });

export const availableStatesAtom = atom<Lodable<string[]>>({
  state: 'default',
});

export const selectedStateAtom = atom<Lodable<string>>({ state: 'default' });

export const isDropdownOpenAtom = atom<boolean>(false);
