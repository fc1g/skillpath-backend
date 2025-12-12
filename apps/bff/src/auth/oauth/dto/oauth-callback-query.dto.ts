import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class OAuthCallbackQueryDto {
	@IsNotEmpty()
	code: string;

	@IsOptional()
	scope?: string;

	@IsOptional()
	state?: string;

	@IsOptional()
	authuser?: number;

	@IsOptional()
	prompt?: string;

	@IsOptional()
	@IsIn([
		'access_denied',
		'unauthorized_client',
		'invalid_request',
		'unsupported_response_type',
		'invalid_scope',
		'server_error',
		'temporarily_unavailable',
	])
	error?: string;

	@IsOptional()
	error_description?: string;
}
