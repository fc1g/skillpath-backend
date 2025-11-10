import * as Joi from 'joi';

export const authSchema = Joi.object({
	ACCESS_PRIVATE_KEY_PATH: Joi.string().required(),
	ACCESS_PUBLIC_KEY_PATH: Joi.string().required(),
	REFRESH_PRIVATE_KEY_PATH: Joi.string().required(),
	REFRESH_PUBLIC_KEY_PATH: Joi.string().required(),

	ACCESS_JWT_ISSUER: Joi.string().required(),
	ACCESS_JWT_AUDIENCE: Joi.string().required(),
	REFRESH_JWT_ISSUER: Joi.string().optional(),
	REFRESH_JWT_AUDIENCE: Joi.string().optional(),

	ACCESS_EXPIRES: Joi.string().required(),
	REFRESH_EXPIRES: Joi.string().required(),

	OAUTH_GITHUB_CLIENT_ID: Joi.string().required(),
	OAUTH_GITHUB_CLIENT_SECRET: Joi.string().required(),
	OAUTH_GITHUB_CALLBACK_URL: Joi.string().uri().required(),

	OAUTH_GOOGLE_CLIENT_ID: Joi.string().required(),
	OAUTH_GOOGLE_CLIENT_SECRET: Joi.string().required(),
	OAUTH_GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
});
