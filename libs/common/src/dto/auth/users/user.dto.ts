import { Exclude, Expose, Type } from 'class-transformer';
import { RoleDto } from '@app/common/dto';

export class UserDto {
	@Expose()
	id: string;

	@Expose()
	email: string;

	@Exclude()
	password: string;

	@Expose()
	@Type(() => RoleDto)
	roles: RoleDto[];

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}
