import {
	Controller,
	Get,
	Param,
	ParseEnumPipe,
	Query,
	Req,
	Res,
} from '@nestjs/common';
import { OauthService } from './oauth.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ProviderType } from '@app/common';
import type { Request, Response } from 'express';
import { OAuthCallbackQueryDto } from './dto/oauth-callback-query.dto';

@ApiTags('OAuth')
@ApiParam({
	name: 'provider',
	enum: ProviderType,
	enumName: 'ProviderType',
	description: 'OAuth provider',
})
@Controller('oauth')
export class OauthController {
	constructor(private readonly oauthService: OauthService) {}

	@Get(':provider')
	redirect(
		@Param('provider', new ParseEnumPipe(ProviderType)) provider: ProviderType,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.oauthService.redirect(req, res, provider);
	}

	@Get(':provider/callback')
	async handleCallback(
		@Param('provider', new ParseEnumPipe(ProviderType)) provider: ProviderType,
		@Query() _query: OAuthCallbackQueryDto,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.oauthService.handleCallback(req, res, provider);
	}
}
