import { Expose, Type } from 'class-transformer';
import { RoleType } from '@app/common/enums';
import { UserDto } from '@app/common/dto';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
	@Expose()
	@ApiProperty({ description: 'Role ID', example: 'r_123', readOnly: true })
	id: string;

	@Expose()
	@ApiProperty({
		description: 'Role name',
		enum: RoleType,
		enumName: 'RoleType',
		example: RoleType.USER,
	})
	name: RoleType;

	@Expose()
	@Type(() => UserDto)
	@ApiProperty({
		description: 'Users assigned to this role',
		type: () => UserDto,
		isArray: true,
	})
	users: UserDto[];

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
