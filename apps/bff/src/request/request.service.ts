import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { RawAxiosRequestHeaders } from 'axios';

@Injectable()
export class RequestService {
	extractHeaders(req: Request): RawAxiosRequestHeaders {
		return {
			cookie: req.headers.cookie ?? '',
			authorization: String(req.headers.authorization ?? ''),
			'x-request-id': String(req.headers['X-request-id'] ?? ''),
		};
	}

	validateAuth(headers: RawAxiosRequestHeaders): void {
		if (!headers) {
			throw new UnauthorizedException('Unauthorized');
		}
	}
}
