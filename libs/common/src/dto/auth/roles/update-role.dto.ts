import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from '@app/common/dto/auth/roles';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
