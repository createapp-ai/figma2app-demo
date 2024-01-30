import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '~/prisma';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const isProd = process.env.NODE_ENV === 'production';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: isProd
        ? configService.get('SUPABASE_JWT_SECRET')
        : configService.get('DEV_JWT_SECRET'),
    });
  }

  async validate({ sub }: { sub?: string }) {
    if (!sub) {
      return null;
    }
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { authId: sub },
      });
      return user;
    } catch (error: unknown) {
      return null;
    }
  }
}
