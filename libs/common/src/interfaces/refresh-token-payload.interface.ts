export interface RefreshTokenPayloadInterface {
	type: 'refresh' | 'access';
	userId: string;
	jti: string;
}
