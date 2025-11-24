import { Injectable } from '@nestjs/common';
import { HttpService } from '@app/common';
import type { Request } from 'express';

@Injectable()
export class CoursesService {
	constructor(private readonly http: HttpService) {}

	async proxy(req: Request, body: unknown) {
		return this.http.post('/graphql', body, {
			headers: {
				'Content-Type': 'application/json',
				authorization: req.headers['authorization'] ?? '',
				cookie: req.headers['cookie'] ?? '',
			},
			withCredentials: true,
		});
	}
}
