import { registerEnumType } from '@nestjs/graphql';

export enum QuizType {
	SINGLE_CHOICE = 'single-choice',
	MULTIPLE_CHOICE = 'multiple-choice',
}

registerEnumType(QuizType, {
	name: 'QuizType',
});
