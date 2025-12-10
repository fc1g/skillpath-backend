import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { HttpModule } from '@app/common';
import { AuthModule } from '../auth/auth.module';
import { RequestModule } from '../request/request.module';

@Module({
	imports: [
		HttpModule.register({ service: 'courses' }),
		AuthModule,
		RequestModule,
	],
	controllers: [CoursesController],
	providers: [CoursesService],
})
export class CoursesModule {}
