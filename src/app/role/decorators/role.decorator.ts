import { SetMetadata } from '@nestjs/common';
import { role } from '@prisma/client';

export const Roles_KEY = 'roles';
export const Roles = (...roles: role[]) => SetMetadata(Roles_KEY, roles);
