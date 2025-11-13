import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { OAuthUser, ProviderType } from '@app/common';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy) {
	constructor(protected readonly configService: ConfigService) {
		super({
			clientID: configService.getOrThrow<string>('OAUTH_GOOGLE_CLIENT_ID'),
			clientSecret: configService.getOrThrow<string>(
				'OAUTH_GOOGLE_CLIENT_SECRET',
			),
			callbackURL: configService.getOrThrow<string>(
				'OAUTH_GOOGLE_CALLBACK_URL',
			),
			scope: ['profile', 'email'],
			proxy: true,
		});
	}

	validate(
		_accessToken: string,
		_refreshToken: string,
		profile: Profile,
		done: VerifyCallback,
	): void {
		const { id, username } = profile;

		const email = (profile?.emails ?? []).find(
			email => email.verified && email.value,
		);

		if (!email) {
			return done(new UnauthorizedException('Email address is required'));
		}

		const user = {
			provider: ProviderType.GOOGLE,
			providerId: id,
			email: email.value,
			username,
		} as OAuthUser;

		done(null, user);
	}
}
