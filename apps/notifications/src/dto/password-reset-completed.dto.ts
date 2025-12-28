import { IsEmail, IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';

export class PasswordResetCompletedDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsOptional()
	@IsEmpty()
	username: string | null;
}
