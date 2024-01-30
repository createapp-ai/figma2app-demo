export type { Lodable } from '~/types';

export interface Event {
  id: string;
  date: Date;
  beginHours: string;
  address: string;
  thumbnail: string;
  title: string;
}

export interface UpcomingEvent extends Event {
  avatars: string[];
  totalUsers: number;
}
