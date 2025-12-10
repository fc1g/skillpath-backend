import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@app/common';
import type { Request, Response } from 'express';
import { RequestService } from '../request/request.service';
import { AuthService } from '../auth/auth.service';
import { HttpStatusCode, RawAxiosRequestHeaders } from 'axios';

type GraphQLFailedResponse = {
	errors: {
		message: string;
		extensions: {
			status: number;
			originalError: {
				message: string;
				error: string;
				statusCode: number;
			};
		};
	}[];
};

type GraphQLSuccessfulResponse = {
	data: unknown;
};

type GraphQLResponse = GraphQLFailedResponse | GraphQLSuccessfulResponse;

@Injectable()
export class CoursesService {
	private readonly logger: Logger = new Logger(CoursesService.name);

	constructor(
		private readonly http: HttpService,
		private readonly requestService: RequestService,
		private readonly authService: AuthService,
	) {}

	async proxy(req: Request, res: Response, body: unknown) {
		const headers = this.requestService.extractHeaders(req);
		this.requestService.validateAuth(headers);
		return this.executeWithAuthRetry(
			req,
			res,
			(headers: RawAxiosRequestHeaders): Promise<GraphQLResponse> =>
				this.http.post('/graphql', body, {
					headers: {
						'Content-Type': 'application/json',
						...headers,
					},
					withCredentials: true,
				}),
		);
	}

	private async executeWithAuthRetry(
		req: Request,
		res: Response,
		callback: (headers: RawAxiosRequestHeaders) => Promise<GraphQLResponse>,
	) {
		const headers = this.extractAndValidateHeaders(req);
		const responseBody = await callback(headers);
		if ('data' in responseBody && responseBody.data !== null) {
			return responseBody;
		}

		if (
			'errors' in responseBody &&
			responseBody.errors?.[0].message === 'Unauthorized'
		) {
			try {
				this.logger.warn('Unauthorized, attempting to refresh tokens');
				await this.authService.rotateTokensAndUpdate(req, res);
				const headers = this.extractAndValidateHeaders(req);
				return await callback(headers);
			} catch (err) {
				if (
					(err as { status?: number }).status === HttpStatusCode.Unauthorized &&
					(err as { message?: string }).message === 'Unauthorized'
				) {
					this.logger.warn(
						'Unauthorized after token refresh, logging out user',
					);
					await this.authService.logout(req, res);
					res.status(HttpStatusCode.Unauthorized).send();
					return;
				}
			}
		}

		if ('errors' in responseBody) {
			res
				.status(
					responseBody.errors[0].extensions?.status ||
						responseBody.errors[0].extensions.originalError?.statusCode ||
						HttpStatusCode.InternalServerError,
				)
				.send(responseBody.errors[0].extensions.originalError);
			return;
		}
	}

	private extractAndValidateHeaders(req: Request) {
		const headers = this.requestService.extractHeaders(req);
		this.requestService.validateAuth(headers);
		return headers;
	}
}
