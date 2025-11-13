import { Module } from '@nestjs/common';
import { ConfigModule, RedisModule } from '@app/common';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import accessJwtConfig, { ACCESS_JWT } from './config/access-jwt.config';
import refreshJwtConfig, { REFRESH_JWT } from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtTokensService } from './jwt-tokens.service';

@Module({
	imports: [
		ConfigModule.forFeature([accessJwtConfig, refreshJwtConfig]),
		RedisModule,
	],
	providers: [
		{
			provide: ACCESS_JWT,
			inject: [accessJwtConfig.KEY],
			useFactory: (config: ConfigType<typeof accessJwtConfig>) =>
				new JwtService(config),
		},
		{
			provide: REFRESH_JWT,
			inject: [refreshJwtConfig.KEY],
			useFactory: (config: ConfigType<typeof refreshJwtConfig>) =>
				new JwtService(config),
		},
		JwtTokensService,
		RefreshTokenIdsStorage,
	],
	exports: [JwtTokensService],
})
export class JwtTokensModule {}
