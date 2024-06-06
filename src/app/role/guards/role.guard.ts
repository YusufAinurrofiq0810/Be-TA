import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, role } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Roles_KEY } from '../decorators/role.decorator';

export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: role[] = this.reflector.getAllAndOverride(Roles_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const req: Request = context.switchToHttp().getRequest();
    const user: User = req['user'];

    return requiredRoles.some((role: role) => role === user.role);
  }
}
