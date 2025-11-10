import { type DynamicModule, Module } from '@nestjs/common';
import {
	ConfigModuleOptions,
	ConfigurableConfigModuleClass,
} from '@app/common/config/config.module-definition';
import {
	ConfigFactory,
	ConfigModule as NestConfigModule,
} from '@nestjs/config';
import * as Joi from 'joi';

@Module({})
export class ConfigModule extends ConfigurableConfigModuleClass {
	static forRoot({
		isGlobal = true,
		validationSchemas = [],
	}: ConfigModuleOptions & { isGlobal?: boolean }): DynamicModule {
		return {
			module: ConfigModule,
			imports: [
				NestConfigModule.forRoot({
					isGlobal,
					validationSchema: ConfigModule.composeSchemas({ validationSchemas }),
					validationOptions: {
						abortEarly: false,
						allowUnknown: true,
					},
				}),
			],
			exports: [NestConfigModule],
		};
	}

	static forFeature(configs: ConfigFactory[]): DynamicModule {
		return {
			module: ConfigModule,
			imports: configs.map(config => NestConfigModule.forFeature(config)),
			exports: [NestConfigModule],
		};
	}

	private static composeSchemas({
		validationSchemas: schemas,
	}: ConfigModuleOptions) {
		if (!schemas || !schemas.length) return Joi.object({});
		return schemas.reduce((acc, schema) => acc.concat(schema), Joi.object({}));
	}
}
