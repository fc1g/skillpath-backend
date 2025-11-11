import { RoleType } from '@app/common/enums';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = Symbol('ROLES_KEY');
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
