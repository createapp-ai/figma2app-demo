import { loadStripe } from '@stripe/stripe-js';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useIsAuthed } from '~/auth';
import { createAxios } from '~/axios';

import { eventAtom, paymentRequestAtom, ticketAtom } from '../states';
import { Event, Ticket } from '../types';

const axios = createAxios('/event-details/buy-ticket');

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
);

export const useBuyTicket = () => {
  const { id } = useParams<{ id: string }>();
  const [event] = useAtom(eventAtom);
  const [ticket, setTicket] = useAtom(ticketAtom);
  const isAuthed = useIsAuthed();
  const [paymentRequest, setPaymentRequest] = useAtom(paymentRequestAtom);

  async function preparePaymentRequest(event: Event) {
    setPaymentRequest({ state: 'loading' });
    try {
      const stripe = await stripePromise;
      const paymentRequest = stripe?.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: `Ticket for ${event.title}`,
          amount: event.price * 100,
        },
        requestPayerEmail: true,
        requestPayerPhone: true,
      });

      if (!paymentRequest) {
        throw new Error('Failed to create payment request');
      }

      if (!(await paymentRequest.canMakePayment())) {
        throw new Error('Cannot make payment with this device');
      }
      setPaymentRequest({ state: 'hasData', data: paymentRequest });
    } catch (error) {
      setPaymentRequest({ state: 'hasError', error: (error as Error).message });
    }
  }

  async function buyTicket() {
    if (!isAuthed || paymentRequest.state !== 'hasData') {
      setTicket({ state: 'hasError', error: 'Not ready to buy ticket' });
      return;
    }

    paymentRequest.data.show();

    paymentRequest.data.on('token', async function (event) {
      setTicket({ state: 'loading' });
      try {
        const { data: ticket } = await axios.post<Ticket>('/buy-ticket', {
          eventId: id,
          token: event.token.id,
        });
        setTicket({ state: 'hasData', data: ticket });
        event.complete('success');
      } catch (error) {
        setTicket({ state: 'hasError', error: (error as Error).message });
        event.complete('fail');
      }
    });

    paymentRequest.data.on('cancel', function () {
      setTicket({ state: 'hasError', error: 'Payment cancelled' });
    });
  }

  useEffect(() => {
    if (event.state === 'hasData') {
      preparePaymentRequest(event.data);
    }

    return () => {
      setPaymentRequest({ state: 'default' });
      setTicket({ state: 'default' });
    };
  }, [event]);

  return {
    buyTicket,
    ticket,
    isReady: paymentRequest.state === 'hasData',
    error:
      paymentRequest.state === 'hasError'
        ? paymentRequest.error
        : ticket.state === 'hasError'
        ? ticket.error
        : undefined,
  };
};
