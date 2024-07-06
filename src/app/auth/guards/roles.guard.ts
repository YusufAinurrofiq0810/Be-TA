/* eslint-disable prettier/prettier */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { role } from '@prisma/client';
  
  @Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log("Allowed Roles: ", allowedRoles);
    if (!allowedRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasRole = allowedRoles.includes(user.role);
    console.log(hasRole);
    if (!hasRole) {
      throw new ForbiddenException('You do not have permission to access this menu');
    }

    return true;
  }
}

  