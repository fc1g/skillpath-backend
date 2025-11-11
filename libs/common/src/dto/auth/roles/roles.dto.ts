import { Expose, Type } from 'class-transformer';
import { RoleDto } from '@app/common/dto/auth/roles/role.dto';

export class RolesDto {
	@Expose()
	@Type(() => RoleDto)
	roles: RoleDto[];
}
