import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetCompletedDto } from './dto/password-reset-completed.dto';

const greet = (username?: string) => `Hi${username ? `, ${username}` : ''}`;

@Injectable()
export class NotificationsFactory {
	constructor(private readonly config: ConfigService) {}

	passwordResetRequested(dto: PasswordResetRequestDto) {
		const year = new Date().getFullYear();
		const frontend = this.config.getOrThrow<string>('FRONTEND_URL');
		const resetLink = `${frontend}/auth/reset-password?token=${encodeURIComponent(dto.token)}`;
		const ttlLabel = `${dto.ttlLabel} minutes`;

		return {
			to: dto.email,
			subject: 'SkillPath — Reset your password',
			template: 'password-reset',
			context: {
				username: dto.username,
				resetLink,
				ttlLabel,
				year,
			},
			text: `
${greet(dto.username)}

We received a request to reset your SkillPath password.

Reset link:
${resetLink}

This link expires in ${ttlLabel}.
If you didn’t request this, you can safely ignore this email.

— SkillPath
      `.trim(),
		};
	}

	passwordResetCompleted(dto: PasswordResetCompletedDto) {
		const year = new Date().getFullYear();
		const frontend = this.config.getOrThrow<string>('FRONTEND_URL');
		const loginLink = `${frontend}/auth/login`;
		const supportEmail = this.config.getOrThrow<string>('SMTP_USER'); // або SUPPORT_EMAIL, якщо додаси

		return {
			to: dto.email,
			subject: 'SkillPath — Your password was changed',
			template: 'password-reset-completed',
			context: {
				username: dto.username ?? '',
				loginLink,
				supportEmail,
				year,
			},
			text: `
${greet(dto.username ?? '')}

Your SkillPath password was successfully changed.

Log in:
${loginLink}

If you didn’t make this change, contact us immediately at:
${supportEmail}

— SkillPath
      `.trim(),
		};
	}
}
