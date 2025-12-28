import { Logger } from '@nestjs/common';

export interface HandleMessageOptions {
	errorMessage?: string;
	requeueOnError?: boolean;
	ackOnError?: boolean;
	logger?: Logger;
}
