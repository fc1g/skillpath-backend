import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from '@app/common/dto/auth/roles';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
