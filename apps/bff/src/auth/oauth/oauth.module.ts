import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { HttpModule } from '@app/common';
import { CookieModule } from '../cookie/cookie.module';
import { RequestModule } from '../request/request.module';

@Module({
	imports: [
		HttpModule.register({ service: 'auth' }),
		CookieModule,
		RequestModule,
	],
	controllers: [OauthController],
	providers: [OauthService],
})
export class OauthModule {}
