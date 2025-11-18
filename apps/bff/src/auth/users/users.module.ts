import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@app/common';
import { RequestModule } from '../request/request.module';

@Module({
	imports: [HttpModule.register({ service: 'auth' }), RequestModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
