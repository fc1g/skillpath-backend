import { Module } from '@nestjs/common';
import { OAuthAccountsService } from './oauth-accounts.service';
import { OAuthAccountsController } from './oauth-accounts.controller';
import { OAuthAccountsRepository } from './oauth-accounts.repository';
import { DatabaseModule, OAuthAccount } from '@app/common';

@Module({
	imports: [DatabaseModule.forFeature([OAuthAccount])],
	controllers: [OAuthAccountsController],
	providers: [OAuthAccountsService, OAuthAccountsRepository],
	exports: [OAuthAccountsService],
})
export class OAuthAccountsModule {}
