import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

import { AuthedUser, OnlyAuthed } from '~/auth';
import { PrismaService } from '~/prisma';

interface Event {
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

@Controller('/event-details/load-data')
export default class EventsController {
  constructor(private readonly prisma: PrismaService) {}

  @OnlyAuthed()
  @Get('events/:id')
  async getEvent(
    @AuthedUser() user: AuthedUser,
    @Param('id') id: string,
  ): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: true,
        location: {
          select: {
            state: true,
          },
        },
        tickets: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    return {
      address: event.address,
      avatars: event.tickets
        .slice(0, 3)
        .map(
          (ticket) =>
            ticket.user.avatarUrl ??
            `https://i.pravatar.cc/300?random=${ticket.user.id}`,
        ),
      date: {
        begin: event.beginTime,
        end: event.endTime,
      },
      description: event.description,
      location: event.location?.state ?? 'Unknown',
      numberOfUsers: event.tickets.length,
      organizer: {
        avatar:
          event.organizer.avatarUrl ??
          `https://i.pravatar.cc/300?random=${event.organizer.id}`,
        nickname: event.organizer.name,
      },
      price: event.price,
      thumbnail: event.thumbnailUrl,
      title: event.title,
      hasAlreadyJoined: event.tickets.some(
        (ticket) => ticket.userId === user.id,
      ),
    };
  }
}
