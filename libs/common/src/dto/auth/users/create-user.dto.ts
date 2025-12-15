import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty({
		description: 'User email address',
		example: 'dev@example.com',
		format: 'email',
	})
	email: string;

	@IsStrongPassword()
	@IsOptional()
	@ApiProperty({
		description: 'User password (optional for OAuth signups)',
		example: 'StrongPass123!',
		nullable: true,
	})
	password?: string | null;

	@IsOptional()
	@ApiProperty({
		description: 'User username/handle (optional)',
		example: 'octocat',
		nullable: true,
	})
	username?: string;
}
