import {
	AUTH_SERVICE,
	baseSchema,
	ConfigModule,
	Course,
	DatabaseModule,
	databaseSchema,
	HealthModule,
	LoggerModule,
} from '@app/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ClientsModule, Transport } from '@nestjs/microservices';
import type { Request } from 'express';
import * as Joi from 'joi';
import { join } from 'path';
import { CategoriesModule } from './categories/categories.module';
import { CoursesRepository } from './courses.repository';
import { CoursesResolver } from './courses.resolver';
import { CoursesService } from './courses.service';
import { FieldResolversModule } from './field-resolvers/field-resolvers.module';
import { SectionsModule } from './sections/sections.module';
import { TagsModule } from './tags/tags.module';
import { UserRatingsModule } from './user-ratings/user-ratings.module';
import { ProgressModule } from './progress/progress.module';
import { CourseUserRatingAndProgressResolver } from './field-resolvers/course-user-rating-and-progress.resolver';

@Module({
	imports: [
		HealthModule,
		LoggerModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchemas: [
				Joi.object({
					HTTP_PORT: Joi.number().port().required(),

					AUTH_HOST: Joi.string().hostname().required(),
					AUTH_PORT: Joi.number().port().required(),
				}),
				baseSchema,
				databaseSchema,
			],
		}),
		DatabaseModule,
		DatabaseModule.forFeature([Course]),
		ClientsModule.registerAsync({
			isGlobal: true,
			clients: [
				{
					name: AUTH_SERVICE,
					useFactory: (config: ConfigService) => ({
						transport: Transport.TCP,
						options: {
							host: config.getOrThrow<string>('AUTH_HOST'),
							port: config.getOrThrow<number>('AUTH_PORT'),
						},
					}),
					inject: [ConfigService],
				},
			],
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			playground: false,
			graphiql: true,
			autoSchemaFile: join(process.cwd(), 'apps/courses/schema.graphql'),
			buildSchemaOptions: {
				numberScalarMode: 'integer',
				dateScalarMode: 'timestamp',
			},
			subscriptions: {
				'graphql-ws': true,
			},
			context: ({ req }: { req: Request }) => ({ req }),
		}),
		TagsModule,
		CategoriesModule,
		SectionsModule,
		FieldResolversModule,
		UserRatingsModule,
		ProgressModule,
	],
	providers: [
		CoursesResolver,
		CoursesService,
		CoursesRepository,
		CourseUserRatingAndProgressResolver,
	],
})
export class CoursesModule {}
