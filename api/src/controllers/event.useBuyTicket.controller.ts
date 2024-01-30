import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { IsUUID } from 'class-validator';

import { AuthedUser, OnlyAuthed } from '~/auth';
import { PrismaService } from '~/prisma';

class BuyTicketDto {
  @IsUUID()
  eventId: string;
}

@Controller('/event-details/buy-ticket')
export default class EventController {
  constructor(private readonly prisma: PrismaService) {}

  @OnlyAuthed()
  @Post('buy-ticket')
  async buyTicket(
    @AuthedUser() user: AuthedUser,
    @Body() dto: BuyTicketDto,
  ): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new BadRequestException('Invalid event');
    }

    if (event.price <= 0) {
      throw new BadRequestException('This event is free');
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        userId: user.id,
        eventId: dto.eventId,
      },
    });

    if (!ticket) {
      throw new BadRequestException('Failed to buy ticket');
    }
  }
}
