import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import refreshJwtConfig from '../config/refresh-jwt.config';
import type { Request } from 'express';
import { RefreshTokenPayloadInterface } from '@app/common';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
	Strategy,
	'refresh-jwt',
) {
	constructor(
		@Inject(refreshJwtConfig.KEY)
		private readonly refreshJwtConfigurable: ConfigType<
			typeof refreshJwtConfig
		>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) =>
					(request?.cookies as { refreshToken: string })?.refreshToken ?? '',
			]),
			...refreshJwtConfigurable.verifyOptions,
			secretOrKey: refreshJwtConfigurable.publicKey,
		});
	}

	validate({ userId, jti, type }: RefreshTokenPayloadInterface) {
		if (type !== 'refresh') {
			throw new Error(`Invalid token type: ${type}`);
		}

		return { userId, jti };
	}
}
