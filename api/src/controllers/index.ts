import { default as eventUseBuyTicketController } from './event.useBuyTicket.controller';
import { default as eventUseLoadDataController } from './event.useLoadData.controller';
import { default as homeUseLoadDataController } from './home.useLoadData.controller';
import { default as homeUseLocationSelection } from './home.useLocationSelection';

export const controllers = [
  eventUseLoadDataController,
  eventUseBuyTicketController,
  homeUseLoadDataController,
  homeUseLocationSelection,
];
