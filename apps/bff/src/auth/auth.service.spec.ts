import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpService } from '@app/common';
import { CookieService } from './cookie/cookie.service';
import { RequestService } from './request/request.service';

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
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
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
