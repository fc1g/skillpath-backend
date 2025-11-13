import { Profile, Strategy } from 'passport-github2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { VerifiedCallback } from 'passport-jwt';
import { OAuthUser, ProviderType } from '@app/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly http: HttpService,
		protected readonly configService: ConfigService,
	) {
		super({
			clientID: configService.getOrThrow<string>('OAUTH_GITHUB_CLIENT_ID'),
			clientSecret: configService.getOrThrow<string>(
				'OAUTH_GITHUB_CLIENT_SECRET',
			),
			callbackURL: configService.getOrThrow<string>(
				'OAUTH_GITHUB_CALLBACK_URL',
			),
			scope: ['user:email'],
			proxy: true,
		});
	}

	async validate(
		accessToken: string,
		_refreshToken: string,
		profile: Profile,
		done: VerifiedCallback,
	): Promise<void> {
		const { id, username } = profile;

		let email = profile?.emails?.[0]?.value;
		if (!email) {
			const { data: emails } = await this.http.axiosRef.get<
				{ email: string; primary: boolean; verified: boolean }[]
			>('https://api.github.com/user/emails', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'User-Agent': 'skillpath-app',
					Accept: 'application/vnd.github+json',
				},
			});
			const pick =
				emails.find(email => email.primary && email.verified) ??
				emails.find(email => email.verified) ??
				emails[0];

			email = pick?.email ?? null;
		}

		if (!email) {
			return done(new UnauthorizedException('Email address is required'));
		}

		const user = {
			provider: ProviderType.GITHUB,
			providerId: id,
			email,
			username,
		} as OAuthUser;

		done(null, user);
	}
}
