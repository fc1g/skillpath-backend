import { IsNotEmpty, IsOptional, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
	@IsStrongPassword()
	@IsOptional()
	@ApiProperty({
		description: 'Current password',
		example: 'StrongPass123!',
		nullable: true,
	})
	currentPassword: string | null;

	@IsStrongPassword()
	@IsNotEmpty()
	@ApiProperty({
		description: 'New password',
		example: 'StrongPass123!',
	})
	newPassword: string;
}
