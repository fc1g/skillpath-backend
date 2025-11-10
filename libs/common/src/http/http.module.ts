import {
	ConfigurableHttpModuleClass,
	HttpModuleOptions,
} from '@app/common/http/http.module-definition';
import { HttpService } from '@app/common/http/http.service';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as http from 'node:http';
import * as https from 'node:https';

@Module({})
export class HttpModule extends ConfigurableHttpModuleClass {
	static register({ service }: HttpModuleOptions): DynamicModule {
		return {
			module: HttpModule,
			imports: [
				AxiosHttpModule.registerAsync({
					useFactory: (config: ConfigService) => ({
						baseURL: config.getOrThrow<string>(
							`BASE_${service.toUpperCase()}_HTTP_URL`,
						),
						timeout: config.getOrThrow<number>('HTTP_TIMEOUT'),
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/json',
						},
						responseType: 'json',
						validateStatus: status => status >= 200 && status < 300,
						httpAgent: new http.Agent({ keepAlive: true, maxSockets: 100 }),
						httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 100 }),
					}),
					inject: [ConfigService],
				}),
			],
			providers: [HttpService],
			exports: [AxiosHttpModule, HttpService],
		};
	}
}
