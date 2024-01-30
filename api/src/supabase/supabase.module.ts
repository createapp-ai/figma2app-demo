import { Module } from '@nestjs/common';

import { PrismaService } from '~/prisma/prisma.service';

import { SupabaseService } from './supabase.service.prod';
import { SupabaseStrategy } from './supabase.strategy';

@Module({
  providers: [SupabaseService, SupabaseStrategy, PrismaService],
})
export class SupabaseModule {}
