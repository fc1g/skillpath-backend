import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

@Injectable()
export class AuthAwareHttpClientService {
	private readonly logger = new Logger(AuthAwareHttpClientService.name);

	constructor(private readonly authService: AuthService) {}

	async execute<T>(
		req: Request,
		res: Response,
		callback: () => Promise<T>,
	): Promise<T> {
		try {
			return await this.callWithAuthRetry(req, res, callback);
		} catch (err) {
			if (this.isUnauthorizedError(err)) {
				this.logger.warn('Unauthorized after token refresh, logging out user');
				await this.authService.logout(req, res);
				res.status(HttpStatusCode.Unauthorized).send();
			}

			throw err;
		}
	}

	private async callWithAuthRetry<T>(
		req: Request,
		res: Response,
		callback: () => Promise<T>,
	): Promise<T> {
		try {
			return await callback();
		} catch (err) {
			if (this.isUnauthorizedError(err)) {
				this.logger.warn('Unauthorized, attempting to refresh tokens');
				await this.authService.rotateTokensAndUpdate(req, res);
				return await callback();
			}

			throw err;
		}
	}

	private isUnauthorizedError(err: unknown): boolean {
		return (
			(err as { status?: number }).status === 401 &&
			(err as { message?: string }).message === 'Unauthorized'
		);
	}
}
