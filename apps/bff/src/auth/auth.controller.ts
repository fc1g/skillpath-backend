import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiCookieAuth,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '@app/common';
import type { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Email/password signup' })
	@ApiBody({ type: CreateUserDto, description: 'User credentials' })
	@ApiCreatedResponse({
		description: 'Returns access/refresh token pair',
		schema: {
			type: 'object',
			properties: {
				accessToken: { type: 'string' },
				refreshToken: { type: 'string' },
			},
		},
	})
	@ApiConflictResponse({ description: 'User with this email already exists' })
	@ApiBadRequestResponse({ description: 'Validation error' })
	async signup(
		@Body() createUserDto: CreateUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.signup(createUserDto, res);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Email/password login' })
	@ApiBody({ type: CreateUserDto, description: 'User credentials' })
	@ApiOkResponse({
		description: 'Returns access/refresh token pair',
		schema: {
			type: 'object',
			properties: {
				accessToken: { type: 'string' },
				refreshToken: { type: 'string' },
			},
		},
	})
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBadRequestResponse({ description: 'Provider-only account' })
	async login(
		@Body() createUserDto: CreateUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.login(createUserDto, res);
	}

	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Invalidate current refresh session' })
	@ApiCookieAuth('refreshToken')
	@ApiNoContentResponse({ description: 'Logged out' })
	@ApiUnauthorizedResponse({ description: 'Refresh token invalid/expired' })
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req, res);
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Rotate refresh token and issue new pair' })
	@ApiCookieAuth('refreshToken')
	@ApiOkResponse({
		description: 'Returns new access/refresh token pair',
		schema: {
			type: 'object',
			properties: {
				accessToken: { type: 'string' },
				refreshToken: { type: 'string' },
			},
		},
	})
	@ApiUnauthorizedResponse({ description: 'Refresh token invalidated/expired' })
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.rotateTokens(req, res);
	}
}
