import { ConfigurableModuleBuilder } from '@nestjs/common';
import * as Joi from 'joi';

export type ConfigModuleOptions = {
	validationSchemas?: Joi.ObjectSchema[];
};

export const { ConfigurableModuleClass: ConfigurableConfigModuleClass } =
	new ConfigurableModuleBuilder<ConfigModuleOptions>()
		.setExtras({ isGlobal: true }, (definition, extras) => ({
			...definition,
			global: extras.isGlobal,
		}))
		.setClassMethodName('forRoot')
		.build();
