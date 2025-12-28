import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetPasswordDto {
	@IsNotEmpty()
	@IsStrongPassword()
	@ApiProperty({
		description: 'New password',
		example: 'StrongPass123!',
	})
	newPassword: string;
}
