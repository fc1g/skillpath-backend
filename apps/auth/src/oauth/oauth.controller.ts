import { Controller, Get, UseGuards } from '@nestjs/common';
import { GithubOAuthGuard } from '../guards/github-oauth.guard';
import { CurrentUser, OAuthUser } from '@app/common';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import { OAuthService } from './oauth.service';

@Controller('oauth')
export class OAuthController {
	constructor(private readonly oauthService: OAuthService) {}

	@UseGuards(GithubOAuthGuard)
	@Get('github')
	async githubRedirect() {}

	@UseGuards(GithubOAuthGuard)
	@Get('github/callback')
	async githubCallback(@CurrentUser() oauthUser: OAuthUser) {
		return this.oauthService.handleCallback(oauthUser);
	}

	@UseGuards(GoogleOAuthGuard)
	@Get('google')
	async googleRedirect() {}

	@UseGuards(GoogleOAuthGuard)
	@Get('google/callback')
	async googleCallback(@CurrentUser() oauthUser: OAuthUser) {
		return this.oauthService.handleCallback(oauthUser);
	}
}
