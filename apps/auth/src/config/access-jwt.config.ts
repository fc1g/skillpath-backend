import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';
import { Algorithm } from 'jsonwebtoken';

export const ACCESS_JWT = Symbol('ACCESS_JWT');

export default registerAs('access-jwt', () => ({
	privateKey: readFileSync(process.env.ACCESS_PRIVATE_KEY_PATH ?? '', 'utf8'),
	publicKey: readFileSync(process.env.ACCESS_PUBLIC_KEY_PATH ?? '', 'utf8'),
	signOptions: {
		algorithm: 'RS256' as Algorithm,
		issuer: process.env.ACCESS_JWT_ISSUER,
		audience: process.env.ACCESS_JWT_AUDIENCE,
		expiresIn: parseInt(process.env.ACCESS_EXPIRES ?? '900', 10),
		keyid: 'access-kid-1',
	},
	verifyOptions: {
		algorithms: ['RS256'] as Algorithm[],
		issuer: process.env.ACCESS_JWT_ISSUER,
		audience: process.env.ACCESS_JWT_AUDIENCE,
	},
}));
