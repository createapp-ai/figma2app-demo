import { Body, Controller, Get, Post } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { IsString } from 'class-validator';

import { AuthedUser, OnlyAuthed } from '~/auth';
import { PrismaService } from '~/prisma';

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

class StateDto {
  @IsString()
  state: string;
}

@Controller('/home/location-selection')
export default class LocationController {
  constructor(private readonly prisma: PrismaService) {}

  @OnlyAuthed()
  @Get('states')
  async getStates(): Promise<{ states: string[] }> {
    const locations = await this.prisma.location.findMany();
    const states = locations.map((location) => location.state);
    return { states };
  }

  @OnlyAuthed()
  @Post('selectedState')
  async selectState(
    @Body() stateDto: StateDto,
    @AuthedUser() user: AuthedUser,
  ): Promise<{ selectedState: string }> {
    const selectedState = stateDto.state;
    const location = await this.prisma.location.findFirst({
      where: { state: selectedState },
    });

    if (!location) {
      throw new BadRequestException('Invalid state');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { locationId: location.id },
    });

    return { selectedState };
  }
}
