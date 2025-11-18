import { MeDto, UserDto } from '@app/common';
import { Controller, Get, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('me')
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiOkResponse({
		type: MeDto,
	})
	async getUser(@Req() req: Request): Promise<UserDto> {
		return this.usersService.getMe(req);
	}
}
