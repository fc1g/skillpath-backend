import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDto, RefreshTokenPayloadInterface, User } from '@app/common';
import { JwtTokensService } from './jwt-tokens/jwt-tokens.service';
import { UserMapper } from './users/mappers/user.mapper';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly tokensService: JwtTokensService,
	) {}

	async signup(createUserDto: CreateUserDto) {
		const user = await this.usersService.create(createUserDto);

		const me = UserMapper.toMeDto(user);
		const tokens = await this.tokensService.issuePairForUser(me);

		return {
			user: me,
			...tokens,
		};
	}

	async login(user: User) {
		const me = UserMapper.toMeDto(user);

		const tokens = await this.tokensService.issuePairForUser(me);
		return {
			user: me,
			...tokens,
		};
	}

	async logout({ userId, jti }: RefreshTokenPayloadInterface) {
		return this.tokensService.verifyAndInvalidateRefresh(userId, jti);
	}

	async rotateTokens({ userId, jti }: RefreshTokenPayloadInterface) {
		const user = await this.usersService.findOne(userId);

		const me = UserMapper.toMeDto(user);
		const tokens = await this.tokensService.rotate(me, jti);

		return {
			user: me,
			...tokens,
		};
	}
}
