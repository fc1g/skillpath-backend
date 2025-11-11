import { Expose, Type } from 'class-transformer';
import { RoleType } from '@app/common/enums';
import { UserDto } from '@app/common/dto';

export class RoleDto {
	@Expose()
	id: string;

	@Expose()
	name: RoleType;

	@Expose()
	@Type(() => UserDto)
	users: UserDto[];

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}
