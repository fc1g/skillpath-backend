import { HttpService, UserDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { RequestService } from '../../request/request.service';

@Injectable()
export class UsersService {
	constructor(
		private readonly httpService: HttpService,
		private readonly requestService: RequestService,
	) {}

	async getMe(req: Request): Promise<UserDto> {
		const headers = this.requestService.extractHeaders(req);
		this.requestService.validateAuth(headers);

		return this.httpService.get<UserDto>('users/me', {
			headers,
		});
	}
}
