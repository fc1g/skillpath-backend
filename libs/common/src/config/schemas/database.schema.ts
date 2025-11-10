import * as Joi from 'joi';

export const databaseSchema = Joi.object({
	DATABASE_TYPE: Joi.string().valid('postgres', 'mongodb').required(),
})
	.when(Joi.object({ DATABASE_TYPE: Joi.valid('postgres') }).unknown(), {
		then: Joi.object({
			DATABASE_HOST: Joi.string().hostname().required(),
			DATABASE_PORT: Joi.number().port().required(),
			DATABASE_USERNAME: Joi.string().required(),
			DATABASE_PASSWORD: Joi.string().required(),
			DATABASE_NAME: Joi.string().required(),
			DATABASE_SYNCHRONIZE: Joi.boolean()
				.truthy('true')
				.falsy('false')
				.default(false),
		}),
	})
	.when(Joi.object({ DATABASE_TYPE: Joi.valid('mongodb') }).unknown(), {
		then: Joi.object({
			DATABASE_URI: Joi.string()
				.uri({ scheme: ['mongodb', 'mongodb+srv'] })
				.required(),
		}),
	});
