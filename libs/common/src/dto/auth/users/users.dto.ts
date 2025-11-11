import { Expose, Type } from 'class-transformer';
import { UserDto } from '@app/common/dto';

export class UsersDto {
	@Expose()
	@Type(() => UserDto)
	users: UserDto[];
}
