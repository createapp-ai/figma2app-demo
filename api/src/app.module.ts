import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthController, AuthService } from './auth';
import { controllers } from './controllers';
import { DebugController } from './debug';
import { PrismaService } from './prisma';
import { SupabaseModule, SupabaseService } from './supabase';

@Module({
  controllers: [AuthController, DebugController, ...controllers],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    SupabaseModule,
  ],
  providers: [SupabaseService, PrismaService, AuthService],
})
export class AppModule {}
