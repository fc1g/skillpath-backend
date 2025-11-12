import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigType } from '@nestjs/config';
import accessJwtConfig from '../config/access-jwt.config';
import { User } from '@app/common';
import { AccessTokenPayloadInterface } from '../interfaces/access-token-payload.interface';
import type { Request } from 'express';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
	Strategy,
	'access-jwt',
) {
	constructor(
		private readonly usersService: UsersService,
		@Inject(accessJwtConfig.KEY)
		private readonly accessJwtConfigurable: ConfigType<typeof accessJwtConfig>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request & { Authentication?: string }) =>
					request?.Authentication ?? '',
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
