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

	clearRefreshCookie(res: Response) {
		res.clearCookie('refreshToken', this.baseCookieOptions);
	}

	setRefreshCookie(res: Response, token: string) {
		res.cookie('refreshToken', token, {
			...this.baseCookieOptions,
			maxAge: this.configService.getOrThrow<number>('REFRESH_COOKIE_MAX_AGE'),
		});
	}
}
