import { Injectable } from '@nestjs/common';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetCompletedDto } from './dto/password-reset-completed.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationsFactory } from './notifications.factory';

@Injectable()
export class NotificationsService {
	constructor(
		private readonly mailer: MailerService,
		private readonly notifications: NotificationsFactory,
	) {}

	async sendPasswordResetEmail(
		passwordResetRequestDto: PasswordResetRequestDto,
	) {
		const msg = this.notifications.passwordResetRequested(
			passwordResetRequestDto,
		);
		await this.mailer.sendMail(msg);
	}

	async sendPasswordResetCompletedEmail(
		passwordResetCompletedDto: PasswordResetCompletedDto,
	) {
		const msg = this.notifications.passwordResetCompleted(
			passwordResetCompletedDto,
		);
		await this.mailer.sendMail(msg);
	}
}
