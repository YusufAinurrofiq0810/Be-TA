/* eslint-disable prettier/prettier */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { role } from '@prisma/client';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private allowedRoles: role[]) {}
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!user) {
        throw new ForbiddenException('User not authenticated');
      }
  
      const hasRole = this.allowedRoles.includes(user.role);
      if (!hasRole) {
        throw new ForbiddenException('You do not have permission to perform this action');
      }
  
      return true;
    }
  }
  