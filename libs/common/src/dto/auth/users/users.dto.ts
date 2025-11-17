import { Expose, Type } from 'class-transformer';
import { UserDto } from '@app/common/dto';
import { ApiProperty } from '@nestjs/swagger';

export class UsersDto {
	@Expose()
	@Type(() => UserDto)
	@ApiProperty({
		description: 'List of users',
		type: () => UserDto,
		isArray: true,
	})
	users: UserDto[];
}
