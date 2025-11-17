import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleType } from '@app/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
	@IsEnum(RoleType)
	@IsNotEmpty()
	@ApiProperty({
		description: 'Role name',
		enum: RoleType,
		enumName: 'RoleType',
		example: RoleType.USER,
	})
	name: RoleType;
}
