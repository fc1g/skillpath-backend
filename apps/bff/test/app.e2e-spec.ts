import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BffModule } from '../src/bff.module';
import { App } from 'supertest/types';

describe('BffController (e2e)', () => {
	let app: INestApplication<App>;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [BffModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/health/live (GET)', async () => {
		return request(app.getHttpServer())
			.get('/health/live')
			.expect('content-type', 'application/json; charset=utf-8')
			.expect(200)
			.expect(({ body }) =>
				expect((body as { status: 'ok' | 'error' }).status).toBe('ok'),
			);
	});

	describe('/auth', () => {
		let refreshCookie: string[] = [];

		it('/auth/signup (POST)', async () => {
			const res = await request(app.getHttpServer())
				.post('/auth/signup')
				.send({
					email: 'test3@gmail.com',
					password: 'testPass5642!',
				})
				.expect('content-type', 'application/json; charset=utf-8')
				.expect(201);

			expect(res.body).toEqual(
				expect.objectContaining({ accessToken: expect.any(String) as string }),
			);

			expect((res.body as { accessToken: string }).accessToken).toMatch(
				/^[\w-]+\.[\w-]+\.[\w-]+$/,
			);

			const setCookie = res.headers['set-cookie'] as unknown as string[];
			expect(setCookie).toEqual(
				expect.arrayContaining([expect.stringMatching(/^refreshToken=/)]),
			);
			refreshCookie = setCookie;
		});

		it('/auth/login (POST)', async () => {
			const res = await request(app.getHttpServer())
				.post('/auth/login')
				.send({
					email: 'test3@gmail.com',
					password: 'testPass5642!',
				})
				.expect('content-type', 'application/json; charset=utf-8')
				.expect(200);

			expect(res.body).toEqual(
				expect.objectContaining({ accessToken: expect.any(String) as string }),
			);

			expect((res.body as { accessToken: string }).accessToken).toMatch(
				/^[\w-]+\.[\w-]+\.[\w-]+$/,
			);

			const setCookie = res.headers['set-cookie'] as unknown as string[];
			expect(setCookie).toEqual(
				expect.arrayContaining([expect.stringMatching(/^refreshToken=/)]),
			);
			refreshCookie = setCookie;
		});

		it('/auth/logout (POST)', () => {
			return request(app.getHttpServer())
				.post('/auth/logout')
				.set('Cookie', refreshCookie)
				.expect(204);
		});

		it('/auth/refresh (POST)', () => {
			return request(app.getHttpServer())
				.post('/auth/refresh')
				.set('Cookie', refreshCookie)
				.expect(401);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
