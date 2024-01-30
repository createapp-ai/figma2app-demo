import { PaymentRequest } from '@stripe/stripe-js';
import { atom } from 'jotai';

import { Event, Lodable, Ticket } from './types';

export const eventAtom = atom<Lodable<Event>>({
  state: 'default',
});

export const ticketAtom = atom<Lodable<Ticket>>({
  state: 'default',
});

export const paymentRequestAtom = atom<Lodable<PaymentRequest>>({
  state: 'default',
});
