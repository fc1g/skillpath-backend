import { Injectable } from '@nestjs/common';
import { CreateUserDto, HttpService } from '@app/common';
import { CookieService } from './cookie/cookie.service';
import type { Request, Response } from 'express';
import { RawAxiosRequestHeaders } from 'axios';
import { IssuedTokensDto } from './dto/issued-tokens.dto';
import { RequestService } from './request/request.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly httpService: HttpService,
		private readonly cookieService: CookieService,
		private readonly requestService: RequestService,
	) {}

	async signup(createUserDto: CreateUserDto, res: Response) {
		return this.processAuth<CreateUserDto>(res, 'auth/signup', createUserDto);
	}

	async login(createUserDto: CreateUserDto, res: Response) {
		return this.processAuth<CreateUserDto>(res, 'auth/login', createUserDto);
	}

	async logout(req: Request, res: Response) {
		const headers = this.requestService.extractHeaders(req);
		this.requestService.validateAuth(headers);

		await this.httpService.post('auth/logout', undefined, { headers });

		this.cookieService.clearRefreshCookie(res);
	}

	async rotateTokens(req: Request, res: Response) {
		const headers = this.requestService.extractHeaders(req);
		this.requestService.validateAuth(headers);

		return this.processAuth<undefined>(res, 'auth/refresh', undefined, headers);
	}

	private async processAuth<T>(
		res: Response,
		url: string,
		data?: T,
		headers?: RawAxiosRequestHeaders,
	): Promise<{ accessToken: string }> {
		const { accessToken, refreshToken } =
			await this.httpService.post<IssuedTokensDto>(url, data, { headers });

		this.cookieService.setRefreshCookie(res, refreshToken);

		return {
			accessToken,
		};
	}
}
