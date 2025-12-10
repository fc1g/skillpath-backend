import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, HttpService } from '@app/common';
import { CookieService } from './cookie/cookie.service';
import type { Request, Response } from 'express';
import { RawAxiosRequestHeaders } from 'axios';
import { IssuedTokensDto } from './dto/issued-tokens.dto';
import { RequestService } from '../request/request.service';

@Injectable()
export class AuthService {
	private readonly logger: Logger = new Logger(AuthService.name);

	constructor(
		private readonly httpService: HttpService,
		private readonly cookieService: CookieService,
		private readonly requestService: RequestService,
	) {}

	async signup(createUserDto: CreateUserDto, res: Response) {
		await this.processAuth<CreateUserDto>(res, 'auth/signup', createUserDto);
	}

	async login(createUserDto: CreateUserDto, res: Response) {
		await this.processAuth<CreateUserDto>(res, 'auth/login', createUserDto);
	}

	async logout(req: Request, res: Response) {
		try {
			const headers = this.requestService.extractHeaders(req);
			this.requestService.validateAuth(headers);
			await this.httpService.post('auth/logout', undefined, { headers });
		} catch (err) {
			this.logger.warn('Logout error, clearing cookies anyway', err);
		} finally {
			this.clearCookies(res);
		}
	}

	async rotateTokens(req: Request, res: Response) {
		const headers = this.requestService.extractHeaders(req);
		this.requestService.validateAuth(headers);

		await this.processAuth<undefined>(res, 'auth/refresh', undefined, headers);
	}

	async rotateTokensAndUpdate(req: Request, res: Response) {
		let tokens: IssuedTokensDto;

		try {
			const headers = this.requestService.extractHeaders(req);
			this.requestService.validateAuth(headers);

			tokens = await this.processAuth<undefined>(
				res,
				'auth/refresh',
				undefined,
				headers,
			);
		} catch (err) {
			this.clearCookies(res);
			throw err;
		}

		if (req.cookies) {
			req.cookies.accessToken = tokens.accessToken;
			req.cookies.refreshToken = tokens.refreshToken;
		}

		const cookiePairs: string[] = [];
		if (tokens.refreshToken) {
			cookiePairs.push(`refreshToken=${tokens.refreshToken}`);
		}
		if (tokens.accessToken) {
			cookiePairs.push(`accessToken=${tokens.accessToken}`);
		}
		req.headers.cookie = cookiePairs.join('; ');

		return tokens;
	}

	private async processAuth<T>(
		res: Response,
		url: string,
		data?: T,
		headers?: RawAxiosRequestHeaders,
	) {
		const { accessToken, refreshToken } =
			await this.httpService.post<IssuedTokensDto>(url, data, { headers });

		this.cookieService.setCookie(
			res,
			'refreshToken',
			refreshToken,
			'REFRESH_EXPIRES',
		);
		this.cookieService.setCookie(
			res,
			'accessToken',
			accessToken,
			'ACCESS_EXPIRES',
		);

		return {
			accessToken,
			refreshToken,
		};
	}

	private clearCookies(res: Response) {
		this.cookieService.clearCookie(res, 'refreshToken');
		this.cookieService.clearCookie(res, 'accessToken');
	}
}
