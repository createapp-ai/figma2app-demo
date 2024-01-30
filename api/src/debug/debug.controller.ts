import { Controller, Get } from '@nestjs/common';

import { PrismaService } from '~/prisma';

@Controller('/_/debug')
export class DebugController {
  constructor(private prisma: PrismaService) {}

  @Get('/auth-ids')
  async getAuthIds() {
    const users = await this.prisma.user.findMany({
      select: { authId: true },
    });
    return users.map((user) => user.authId);
  }
}
