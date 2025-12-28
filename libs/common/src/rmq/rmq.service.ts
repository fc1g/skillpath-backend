import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { HandleMessageOptions } from '@app/common/interfaces';
import type { Channel, Message } from 'amqplib';

@Injectable()
export class RmqService {
	private readonly logger: Logger = new Logger(RmqService.name);

	async handleMessage<T>(
		ctx: RmqContext,
		handler: () => Promise<T>,
		options: HandleMessageOptions,
	): Promise<T> {
		const channel = ctx.getChannelRef() as Channel;
		const originalMsg = ctx.getMessage() as Message;

		const logger = options.logger ?? this.logger;
		const requeueOnError = options.requeueOnError ?? false;
		const ackOnError = options.ackOnError ?? false;

		try {
			const result = await handler();
			channel.ack(originalMsg);
			return result;
		} catch (err) {
			const base = options.errorMessage ?? 'Error to handle RMQ message';
			logger.error(base, (err as Error)?.stack ?? String(err));

			if (ackOnError) channel.ack(originalMsg);
			else channel.nack(originalMsg, false, requeueOnError);

			throw err;
		}
	}
}
