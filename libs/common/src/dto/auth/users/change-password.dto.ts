import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
	@IsNotEmpty()
	@IsStrongPassword()
	@ApiProperty({
		description: 'Current password',
		example: 'StrongPass123!',
	})
	currentPassword: string;

	@IsNotEmpty()
	@IsStrongPassword()
	@ApiProperty({
		description: 'New password',
		example: 'StrongPass123!',
	})
	newPassword: string;
}
