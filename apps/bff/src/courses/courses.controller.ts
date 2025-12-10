import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { CoursesService } from './courses.service';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Post('graphql')
	async proxy(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() body: unknown,
	) {
		return this.coursesService.proxy(req, res, body);
	}
}
