import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

import { OnlyAuthed, AuthedUser } from '~/auth';
import { PrismaService } from '~/prisma';

export interface Event {
  id: string;
  date: Date;
  beginHours: Date;
  address: string;
  thumbnail: string;
  title: string;
}

export interface UpcomingEvent extends Event {
  avatars: string[];
  totalUsers: number;
}

@Controller('/home/load-data')
export default class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @OnlyAuthed()
  @Get('current-location')
  async getCurrentLocation(
    @AuthedUser() user: AuthedUser,
  ): Promise<{ state: string }> {
    const location = await this.prisma.location.findFirst({
      where: user.locationId ? { id: user.locationId } : {},
    });

    if (!location) {
      throw new BadRequestException('Location not found');
    }

    return { state: location.state };
  }

  @OnlyAuthed()
  @Get('events')
  async getEvents(@Query('state') state: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: {
        location: { state: state },
        date: {
          gte: new Date(),
          lte: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
      },
      orderBy: { date: 'asc' },
      take: 10,
      select: {
        id: true,
        date: true,
        beginTime: true,
        address: true,
        thumbnailUrl: true,
        title: true,
      },
    });
    return events.map((event) => ({
      address: event.address,
      beginHours: event.beginTime,
      date: event.date,
      thumbnail: event.thumbnailUrl,
      title: event.title,
      id: event.id,
    }));
  }

  @UseGuards(OnlyAuthed)
  @Get('upcoming-events')
  async getUpcomingEvents(
    @Query('limit') limit: number,
  ): Promise<UpcomingEvent[]> {
    const upcomingEvents = await this.prisma.event.findMany({
      take: limit,
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        beginTime: true,
        address: true,
        thumbnailUrl: true,
        title: true,
        id: true,
        tickets: {
          select: {
            user: {
              select: {
                avatarUrl: true,
                id: true,
              },
            },
          },
        },
      },
    });
    return upcomingEvents.map((event) => ({
      address: event.address,
      beginHours: event.beginTime,
      date: event.date,
      thumbnail: event.thumbnailUrl,
      title: event.title,
      id: event.id,
      avatars: event.tickets
        .slice(0, 3)
        .map(
          (ticket) =>
            ticket.user.avatarUrl ??
            `https://i.pravatar.cc/300?random=${ticket.user.id}`,
        ),
      totalUsers: event.tickets.length,
    }));
  }
}
