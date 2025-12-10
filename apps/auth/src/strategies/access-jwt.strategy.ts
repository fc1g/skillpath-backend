import { User } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayloadInterface } from '../interfaces/access-token-payload.interface';
import accessJwtConfig from '../jwt-tokens/config/access-jwt.config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
	Strategy,
	'access-jwt',
) {
	constructor(
		private readonly usersService: UsersService,
		@Inject(accessJwtConfig.KEY)
		protected readonly accessJwtConfigurable: ConfigType<
			typeof accessJwtConfig
		>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request & { Authentication?: string }) =>
					((request.cookies?.['accessToken'] || request?.Authentication) as
						| string
						| undefined) ?? '',
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			...accessJwtConfigurable.verifyOptions,
			secretOrKey: accessJwtConfigurable.publicKey,
		});
	}

	async validate({ userId, type }: AccessTokenPayloadInterface): Promise<User> {
		if (type !== 'access') {
			throw new Error(`Invalid token type: ${type}`);
		}

		return this.usersService.findOne(userId);
	}
}
