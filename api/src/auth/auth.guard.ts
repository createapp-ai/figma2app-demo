// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { User } from '@prisma/client';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     const user: User = request.user;

//     if (!user) {
//       throw new ForbiddenException('Not authenticated');
//     }
//     return true;
//   }
// }
