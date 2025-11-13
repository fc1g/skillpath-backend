import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { AccessJwtStrategy } from './access-jwt.strategy';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';
import { ConfigModule } from '@app/common';
import accessJwtConfig from '../jwt-tokens/config/access-jwt.config';
import refreshJwtConfig from '../jwt-tokens/config/refresh-jwt.config';
import { GithubOauthStrategy } from './github-oauth.strategy';
import { GoogleOauthStrategy } from './google-oauth.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		ConfigModule.forFeature([accessJwtConfig, refreshJwtConfig]),
		UsersModule,
		HttpModule,
	],
	providers: [
		LocalStrategy,
		AccessJwtStrategy,
		RefreshJwtStrategy,
		GithubOauthStrategy,
		GoogleOauthStrategy,
	],
	exports: [
		LocalStrategy,
		AccessJwtStrategy,
		RefreshJwtStrategy,
		GithubOauthStrategy,
		GoogleOauthStrategy,
	],
})
export class StrategiesModule {}
