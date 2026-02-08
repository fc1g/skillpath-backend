import { Controller, Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetCompletedDto } from './dto/password-reset-completed.dto';
import {
	AUTH_PASSWORD_RESET_COMPLETED,
	AUTH_PASSWORD_RESET_REQUESTED,
	RmqService,
} from '@app/common';

@Controller()
export class NotificationsController {
	private readonly logger = new Logger(NotificationsController.name);

	constructor(
		private readonly notificationsService: NotificationsService,
		private readonly rmqService: RmqService,
	) {}

	@EventPattern(AUTH_PASSWORD_RESET_REQUESTED)
	async handlePasswordResetCommand(
		@Payload() data: PasswordResetRequestDto,
		@Ctx() context: RmqContext,
	) {
		return this.rmqService.handleMessage(
			context,
			async () => {
				await this.notificationsService.sendPasswordResetEmail(data);
			},
			{
				errorMessage: 'Failed to send password reset email',
				requeueOnError: false,
				logger: this.logger,
			},
		);
	}

	@EventPattern(AUTH_PASSWORD_RESET_COMPLETED)
	async handlePasswordResetCompletedCommand(
		@Payload() data: PasswordResetCompletedDto,
		@Ctx() context: RmqContext,
	) {
		return this.rmqService.handleMessage(
			context,
			async () => {
				await this.notificationsService.sendPasswordResetCompletedEmail(data);
			},
			{
				errorMessage: 'Failed to send password reset completed email',
				requeueOnError: false,
				logger: this.logger,
			},
		);
	}
}
