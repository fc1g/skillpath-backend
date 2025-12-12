import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { MeDto } from '@app/common';

export class IssuedTokensDto {
	@IsNotEmpty()
	accessToken: string;

	@IsNotEmpty()
	refreshToken: string;

	@IsNotEmpty()
	@Type(() => MeDto)
	user: MeDto;
}
