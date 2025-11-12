import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';
import { Algorithm } from 'jsonwebtoken';

export const REFRESH_JWT = Symbol('REFRESH_JWT');

export default registerAs('refresh-jwt', () => ({
	privateKey: readFileSync(process.env.REFRESH_PRIVATE_KEY_PATH ?? '', 'utf8'),
	publicKey: readFileSync(process.env.REFRESH_PUBLIC_KEY_PATH ?? '', 'utf8'),
	signOptions: {
		algorithm: 'RS256' as Algorithm,
		issuer: process.env.REFRESH_JWT_ISSUER ?? process.env.ACCESS_JWT_ISSUER,
		audience:
			process.env.REFRESH_JWT_AUDIENCE ??
			(process.env.ACCESS_JWT_AUDIENCE
				? `${process.env.ACCESS_JWT_AUDIENCE}/refresh`
				: undefined),
		expiresIn: parseInt(process.env.REFRESH_EXPIRES ?? '604800', 10),
		keyid: 'refresh-kid-1',
	},
	verifyOptions: {
		algorithms: ['RS256'] as Algorithm[],
		issuer: process.env.REFRESH_JWT_ISSUER ?? '',
		audience:
			process.env.REFRESH_JWT_AUDIENCE ??
			(process.env.ACCESS_JWT_AUDIENCE
				? `${process.env.ACCESS_JWT_AUDIENCE}/refresh`
				: undefined),
	},
}));
