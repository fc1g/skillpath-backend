import { Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { LoggerModule } from '@app/common/logger';

@Module({
	imports: [LoggerModule],
	providers: [RmqService],
	exports: [RmqService],
})
export class RmqModule {}
