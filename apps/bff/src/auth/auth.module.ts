import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@app/common';
import { CookieModule } from './cookie/cookie.module';
import { RequestModule } from './request/request.module';

@Module({
	imports: [
		HttpModule.register({ service: 'auth' }),
		CookieModule,
		RequestModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
