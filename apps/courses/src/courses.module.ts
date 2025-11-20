import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CoursesResolver } from './courses.resolver';
import {
	baseSchema,
	ConfigModule,
	Course,
	DatabaseModule,
	databaseSchema,
	HealthModule,
	LoggerModule,
} from '@app/common';
import * as Joi from 'joi';
import { join } from 'path';
import { CoursesRepository } from './courses.repository';
import { TagsModule } from './tags/tags.module';
import { SectionsModule } from './sections/sections.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { LessonsModule } from './lessons/lessons.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
	imports: [
		HealthModule,
		LoggerModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchemas: [
				Joi.object({
					HTTP_PORT: Joi.number().port().required(),
				}),
				baseSchema,
				databaseSchema,
			],
		}),
		DatabaseModule,
		DatabaseModule.forFeature([Course]),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			playground: false,
			graphiql: true,
			autoSchemaFile: join(process.cwd(), 'apps/courses/schema.graphql'),
			installSubscriptionHandlers: true,
			buildSchemaOptions: {
				numberScalarMode: 'integer',
			},
			subscriptions: {
				'graphql-ws': true,
			},
		}),
		TagsModule,
		SectionsModule,
		QuizzesModule,
		LessonsModule,
		ChallengesModule,
	],
	providers: [CoursesResolver, CoursesService, CoursesRepository],
})
export class CoursesModule {}
