export type { Lodable } from '~/types';

export interface Event {
  location: string;
  address: string;
  avatars: string[];
  date: {
    begin: Date;
    end: Date;
  };
  description: string;
  title: string;
  numberOfUsers: number;
  organizer: {
    nickname: string;
    avatar: string;
  };
  price: number;
  thumbnail: string;
  hasAlreadyJoined: boolean;
}

export interface Ticket {
  id: string;
  event: Event;
  userId: string;
  createdAt: Date;
}
