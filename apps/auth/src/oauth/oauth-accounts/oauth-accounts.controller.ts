import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { OAuthAccountsService } from './oauth-accounts.service';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import {
	OAuthAccount,
	OAuthAccountsDto,
	Roles,
	RoleType,
	Serialize,
	UpdateOAuthAccountDto,
} from '@app/common';

@UseGuards(AccessJwtGuard)
@Roles(RoleType.ADMIN)
@Controller('oauth-accounts')
export class OAuthAccountsController {
	constructor(private readonly oauthAccountsService: OAuthAccountsService) {}

	@Get()
	@Serialize(OAuthAccountsDto)
	async findAll(): Promise<OAuthAccount[]> {
		return this.oauthAccountsService.find();
	}

	@Get(':id')
	@Serialize(OAuthAccount)
	async findOne(
		@Param('id', new ParseUUIDPipe()) id: string,
	): Promise<OAuthAccount> {
		return this.oauthAccountsService.findOne(id);
	}

	@Patch(':id')
	@Serialize(OAuthAccount)
	async update(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() updateOAuthAccountDto: UpdateOAuthAccountDto,
	): Promise<OAuthAccount> {
		return this.oauthAccountsService.update(id, updateOAuthAccountDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(
		@Param('id', new ParseUUIDPipe()) id: string,
	): Promise<OAuthAccount> {
		return this.oauthAccountsService.remove(id);
	}
}
