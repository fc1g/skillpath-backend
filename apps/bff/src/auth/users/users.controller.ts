import { MeDto } from '@app/common';
import {
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Req,
	Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { UsersService } from './users.service';
import { AuthAwareHttpClientService } from '../auth-aware.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authAwareHttpClientService: AuthAwareHttpClientService,
	) {}

	@Get('me')
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiOkResponse({
		type: MeDto,
	})
	async getUser(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	): Promise<MeDto> {
		return this.authAwareHttpClientService.execute<MeDto>(req, res, () =>
			this.usersService.getMe(req),
		);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update current user profile' })
	@ApiOkResponse({
		type: MeDto,
	})
	async updateUser(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Param('id', new ParseUUIDPipe()) userId: string,
	): Promise<MeDto> {
		return this.authAwareHttpClientService.execute<MeDto>(req, res, () =>
			this.usersService.updateUser(req, userId),
		);
	}
}
