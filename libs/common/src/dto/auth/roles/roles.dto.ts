import { Expose, Type } from 'class-transformer';
import { RoleDto } from '@app/common/dto/auth/roles/role.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RolesDto {
	@Expose()
	@Type(() => RoleDto)
	@ApiProperty({
		description: 'List of roles',
		type: () => RoleDto,
		isArray: true,
	})
	roles: RoleDto[];
}
