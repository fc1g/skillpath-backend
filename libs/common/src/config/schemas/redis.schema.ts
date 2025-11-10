import * as Joi from 'joi';

export const redisSchema = Joi.object({
	REDIS_HOST: Joi.string().hostname().default('localhost'),
	REDIS_PORT: Joi.number().port().default(6379),
	REDIS_PASSWORD: Joi.alternatives().conditional('NODE_ENV', {
		is: 'production',
		then: Joi.string().min(1).required(),
		otherwise: Joi.string().default(''),
	}),
	REDIS_DB: Joi.number().positive().default(0),
	REDIS_KEY_PREFIX: Joi.string().default(''),
	REDIS_CONNECT_TIMEOUT_MS: Joi.number().positive().min(1000).default(5000),
});
