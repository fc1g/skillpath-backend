import { IsEmail, IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';

export class PasswordResetRequestDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	token: string;

	@IsNotEmpty()
	ttlLabel: string;

	@IsOptional()
	@IsEmpty()
	username?: string;
}
