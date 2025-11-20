import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { HttpModule } from '@app/common';

@Module({
	imports: [HttpModule.register({ service: 'courses' })],
	controllers: [CoursesController],
	providers: [CoursesService],
})
export class CoursesModule {}
