export interface AccessTokenPayloadInterface {
	userId: string;
	type: 'access' | 'refresh';
}
