import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { UsersModule } from '../users/users.module';
import { JwtTokensModule } from '../jwt-tokens/jwt-tokens.module';
import { OAuthService } from './oauth.service';
import { OAuthAccountsModule } from './oauth-accounts/oauth-accounts.module';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import { GithubOAuthGuard } from '../guards/github-oauth.guard';

@Module({
	imports: [UsersModule, OAuthAccountsModule, JwtTokensModule],
	controllers: [OAuthController],
	providers: [OAuthService, GoogleOAuthGuard, GithubOAuthGuard],
})
export class OAuthModule {}
