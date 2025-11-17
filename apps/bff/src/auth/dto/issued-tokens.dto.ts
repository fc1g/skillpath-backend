import { IsNotEmpty } from 'class-validator';

export class IssuedTokensDto {
	@IsNotEmpty()
	accessToken: string;

	@IsNotEmpty()
	refreshToken: string;
}
