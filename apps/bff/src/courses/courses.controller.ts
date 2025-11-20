import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Post('graphql')
	async proxy(@Req() req: Request, @Body() body: unknown) {
		return this.coursesService.proxy(req, body);
	}
}
