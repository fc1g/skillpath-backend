import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { UsersModule } from '../users/users.module';
import { JwtTokensModule } from '../jwt-tokens/jwt-tokens.module';
import { OAuthService } from './oauth.service';
import { OAuthAccountsModule } from './oauth-accounts/oauth-accounts.module';

@Module({
	imports: [UsersModule, OAuthAccountsModule, JwtTokensModule],
	controllers: [OAuthController],
	providers: [OAuthService],
})
export class OAuthModule {}
