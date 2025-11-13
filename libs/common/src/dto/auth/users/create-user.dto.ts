import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsStrongPassword()
	@IsOptional()
	password?: string | null;
}
