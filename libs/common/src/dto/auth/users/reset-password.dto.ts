import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
	@IsNotEmpty()
	@ApiProperty({
		description: 'Reset password token',
	})
	token: string;

	@IsNotEmpty()
	@IsStrongPassword()
	@ApiProperty({
		description: 'New password',
		example: 'StrongPass123!',
	})
	newPassword: string;
}
