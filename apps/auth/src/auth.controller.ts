import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, User } from '@app/common';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.authService.signup(createUserDto);
	}
}
