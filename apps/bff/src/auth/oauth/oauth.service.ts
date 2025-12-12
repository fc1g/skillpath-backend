import { Injectable } from '@nestjs/common';
import { HttpService, ProviderType } from '@app/common';
import { CookieService } from '../cookie/cookie.service';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
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

	redirect(req: Request, res: Response, providerType: ProviderType) {
		return res.redirect(
			`${this.configService.getOrThrow<string>(
				`OAUTH_${providerType.toUpperCase()}_REDIRECT_URL`,
			)}?state=${req.query.state as string}`,
		);
	}

	async handleCallback(
		req: Request,
		res: Response,
		providerType: ProviderType,
	) {
		const headers = this.requestService.extractHeaders(req);
		this.requestService.validateAuth(headers);

		const { accessToken, refreshToken, user } =
			await this.http.get<IssuedTokensDto>(
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

		const state = req.query.state as string;

		res.send(`
		  <!DOCTYPE html>
		  <html lang="en">
		    <body>
		      <script>
		        (function() {
		          try {
		            const payload = ${JSON.stringify({
									ok: true,
									user,
									state,
								})};
		            window.opener && window.opener.postMessage(payload, window.location.origin);
		          } catch (e) {
		            console.error('OAuth popup error', e);
		          } finally {
		            window.close();
		          }
		        })();
		      </script>
		    </body>
		  </html>
		`);
	}
}
