import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { SupabaseGuard } from '~/supabase';

/**
 * Decorator to enforce authentication for a route.
 *
 * @returns The AuthGuard.
 * @throws {ForbiddenException} If the user is not authenticated
 *
 * @example
 * ```
 * ＠Get('/authed')
 * ＠OnlyAuthed()
 * getAuthedContent() {
 *   return 'Authed content';
 * }
 * ```
 */
export function OnlyAuthed() {
  return UseGuards(SupabaseGuard);
}

/**
 * Custom parameter decorator to retrieve the authenticated user from the request.
 *
 * @remarks
 * This decorator is used to easily access the authenticated user object in the request context.
 * It should be used within route handlers in controllers where authentication is required.
 * If the user is not authenticated, a ForbiddenException is thrown.
 *
 * @param data - Additional data that can be passed to the decorator, currently unused.
 * @param ctx - The execution context from which the HTTP request is extracted.
 * @returns The authenticated user object from the request.
 * @throws {ForbiddenException} If no authenticated user is found in the request.
 *
 * @example
 * ```typescript
 * ＠OnlyAuthed()
 * ＠Get('/profile')
 * getProfile(＠AuthedUser() user: User) {
 *   return user;
 * }
 * ```
 */
export const AuthedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Not authenticated');
    }
    return user;
  },
);

export type AuthedUser = User;
