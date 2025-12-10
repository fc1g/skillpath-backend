import { Injectable } from '@nestjs/common';
import { HttpService, ProviderType } from '@app/common';
import { CookieService } from '../cookie/cookie.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { RequestService } from '../../request/request.service';
import { IssuedTokensDto } from '../dto/issued-tokens.dto';

@Injectable()
export class OauthService {
	constructor(
		private readonly http: HttpService,
		private readonly cookieService: CookieService,
		private readonly requestService: RequestService,
		private readonly configService: ConfigService,
	) {}

	redirect(res: Response, providerType: ProviderType) {
		return res.redirect(
			this.configService.getOrThrow<string>(
				`OAUTH_${providerType.toUpperCase()}_REDIRECT_URL`,
			),
		);
	}

	async handleCallback(
		req: Request,
		res: Response,
		providerType: ProviderType,
	) {
		const headers = this.requestService.extractHeaders(req);
		this.requestService.validateAuth(headers);

		const { accessToken, refreshToken } = await this.http.get<IssuedTokensDto>(
			`oauth/${providerType.toUpperCase()}/callback`,
			{
				params: req.query,
				maxRedirects: 0,
				headers,
				validateStatus: status => status >= 200 && status < 400,
			},
		);

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

		res.redirect(
			this.configService.getOrThrow<string>('CORS_ORIGINS').split(',')[0],
		);
	}
}
