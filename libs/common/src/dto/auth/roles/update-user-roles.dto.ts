import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { RoleType } from '@app/common/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRolesDto {
	@IsOptional()
	@IsArray()
	@IsEnum(RoleType, { each: true })
	@ApiPropertyOptional({
		description: 'Roles to add',
		enum: RoleType,
		enumName: 'RoleType',
		isArray: true,
		example: [RoleType.ADMIN],
	})
	add?: RoleType[];

	@IsOptional()
	@IsArray()
	@IsEnum(RoleType, { each: true })
	@ApiPropertyOptional({
		description: 'Roles to remove',
		enum: RoleType,
		enumName: 'RoleType',
		isArray: true,
		example: [RoleType.ADMIN],
	})
	remove?: RoleType[];
}
