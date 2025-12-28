import { Module } from '@nestjs/common';
import { OneTimeTokenService } from './one-time-token.service';
import { ConfigModule, RedisModule } from '@app/common';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		RedisModule,
	],
	providers: [OneTimeTokenService],
	exports: [OneTimeTokenService],
})
export class OneTimeTokenModule {}
