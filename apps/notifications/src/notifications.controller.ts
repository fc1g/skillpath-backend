import { Controller, Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetCompletedDto } from './dto/password-reset-completed.dto';
import { RmqService } from '@app/common';

@Controller()
export class NotificationsController {
	private readonly logger = new Logger(NotificationsController.name);

	constructor(
		private readonly notificationsService: NotificationsService,
		private readonly rmqService: RmqService,
	) {}

	@EventPattern('auth.password_reset.requested')
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

	@EventPattern('auth.password_reset.completed')
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
