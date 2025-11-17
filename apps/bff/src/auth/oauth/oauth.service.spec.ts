import { Test, TestingModule } from '@nestjs/testing';
import { OauthService } from './oauth.service';
import { HttpService } from '@app/common';
import { CookieService } from '../cookie/cookie.service';
import { RequestService } from '../request/request.service';
import { ConfigService } from '@nestjs/config';

describe('OauthService', () => {
	let service: OauthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OauthService,
				{
					provide: HttpService,
					useValue: {},
				},
				{
					provide: CookieService,
					useValue: {},
				},
				{
					provide: RequestService,
					useValue: {},
				},
				{
					provide: ConfigService,
					useValue: {},
				},
			],
		}).compile();

		service = module.get<OauthService>(OauthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
