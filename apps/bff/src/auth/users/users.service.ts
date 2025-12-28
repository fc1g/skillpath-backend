import { HttpService, MeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { RequestService } from '../../request/request.service';

@Injectable()
export class UsersService {
	constructor(
		private readonly httpService: HttpService,
		private readonly requestService: RequestService,
	) {}

	async getMe(req: Request): Promise<MeDto> {
		const headers = this.requestService.extractHeaders(req);
		this.requestService.validateAuth(headers);

		return this.httpService.get<MeDto>('users/me', {
			headers,
		});
	}

	async updateUser(req: Request, userId: string): Promise<MeDto> {
		const headers = this.requestService.extractHeaders(req);
		this.requestService.validateAuth(headers);

		return this.httpService.patch<MeDto>(`users/${userId}`, req.body, {
			headers,
		});
	}
}
