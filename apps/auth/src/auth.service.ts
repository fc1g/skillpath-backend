import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDto, RefreshTokenPayloadInterface, User } from '@app/common';
import { JwtTokensService } from './jwt-tokens/jwt-tokens.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly tokensService: JwtTokensService,
	) {}

	async signup(createUserDto: CreateUserDto) {
		const user = await this.usersService.create(createUserDto);
		return this.tokensService.issuePairForUser(user);
	}

	async login(user: User) {
		return this.tokensService.issuePairForUser(user);
	}

	async logout({ userId, jti }: RefreshTokenPayloadInterface) {
		return this.tokensService.verifyAndInvalidateRefresh(userId, jti);
	}

	async rotateTokens({ userId, jti }: RefreshTokenPayloadInterface) {
		const user = await this.usersService.findOne(userId);

		return this.tokensService.rotate(user, jti);
	}
}
