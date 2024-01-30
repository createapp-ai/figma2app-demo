import { EventDetailsPage } from './EventDetailsPage';
import { HomePage } from './HomePage';
import { SignInPage } from './SignInPage';
import { SignUpPage } from './SignUpPage';
export { SplashScreen } from './_Splash';

export const screens = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/sign-in',
    component: SignInPage,
  },
  {
    path: '/sign-up',
    component: SignUpPage,
  },
  {
    path: '/event/:id',
    component: EventDetailsPage,
  },
  {
    component: HomePage,
  },
];
