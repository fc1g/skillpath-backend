import * as Joi from 'joi';

export const oauthSchema = Joi.object({
	OAUTH_GITHUB_CLIENT_ID: Joi.string().required(),
	OAUTH_GITHUB_CLIENT_SECRET: Joi.string().required(),
	OAUTH_GITHUB_CALLBACK_URL: Joi.string().uri().required(),

	OAUTH_GOOGLE_CLIENT_ID: Joi.string().required(),
	OAUTH_GOOGLE_CLIENT_SECRET: Joi.string().required(),
	OAUTH_GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
});
