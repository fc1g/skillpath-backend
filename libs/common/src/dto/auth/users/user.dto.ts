import { Exclude, Expose, Type } from 'class-transformer';
import { RoleDto } from '@app/common/dto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class UserDto {
	@Expose()
	@ApiProperty({ description: 'User ID', example: 'c1a2b3', readOnly: true })
	id: string;

	@Expose()
	@ApiProperty({
		description: 'User email address',
		example: 'dev@example.com',
		format: 'email',
	})
	email: string;

	@Exclude()
	@ApiHideProperty()
	password: string | null;

	@Expose()
	username?: string;

	@Expose()
	@Type(() => RoleDto)
	@ApiProperty({
		description: 'Assigned roles',
		type: () => RoleDto,
		isArray: true,
	})
	roles: RoleDto[];

	@Expose()
	@ApiProperty({
		description: 'Creation timestamp',
		type: String,
		format: 'date-time',
		readOnly: true,
	})
	createdAt: Date;

	@Expose()
	@ApiProperty({
		description: 'Last update timestamp',
		type: String,
		format: 'date-time',
		readOnly: true,
	})
	updatedAt: Date;
}
