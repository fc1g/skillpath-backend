import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieService {
	private readonly baseCookieOptions: CookieOptions = {
		secure: false,
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
	};

	constructor(private readonly configService: ConfigService) {
		this.baseCookieOptions.secure =
			configService.getOrThrow<string>('NODE_ENV') === 'production';
	}

	clearCookie(res: Response, key: string) {
		res.clearCookie(key, this.baseCookieOptions);
	}

	setCookie(res: Response, key: string, value: string, maxAgeEnv: string) {
		res.cookie(key, value, {
			...this.baseCookieOptions,
			maxAge: this.configService.getOrThrow<number>(maxAgeEnv) * 1000,
		});
	}
}
