import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { RoleType } from '@app/common/enums';

export class UpdateUserRolesDto {
	@IsOptional()
	@IsArray()
	@IsEnum(RoleType, { each: true })
	add?: RoleType[];

	@IsOptional()
	@IsArray()
	@IsEnum(RoleType, { each: true })
	remove?: RoleType[];
}
