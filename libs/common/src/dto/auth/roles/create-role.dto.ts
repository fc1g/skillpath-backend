import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleType } from '@app/common/enums';

export class CreateRoleDto {
	@IsEnum(RoleType)
	@IsNotEmpty()
	name: RoleType;
}
