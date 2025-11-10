import { ConfigurableModuleBuilder } from '@nestjs/common';

export type HttpModuleOptions = {
	service: string;
};

export const { ConfigurableModuleClass: ConfigurableHttpModuleClass } =
	new ConfigurableModuleBuilder<HttpModuleOptions>()
		.setClassMethodName('register')
		.build();
