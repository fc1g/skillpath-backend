import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { Lesson } from '@app/common/entities/courses/lesson.entity';
import { QuizType } from '@app/common/enums/quiz-type.enum';

@ObjectType()
@Entity('quizzes')
@Index('idx_quiz_lesson_order', ['lesson', 'order'], { unique: true })
export class Quiz extends AbstractEntity<Quiz> {
	@Field()
	@Column('text')
	question: string;

	@Field(() => QuizType)
	@Column('enum', {
		enum: QuizType,
		enumName: 'quiz_type',
		default: QuizType.SINGLE_CHOICE,
	})
	type: QuizType;

	@Field(() => [String])
	@Column('text', { array: true })
	options: string[];

	@Field(() => Int)
	@Column('int', { name: 'correct_option_index' })
	correctOptionIndex: number;

	@Field()
	@Column('text', { nullable: true })
	explanation?: string | null;

	@Field(() => Int)
	@Column('int', { default: 0 })
	order: number;

	@Field(() => Lesson)
	@ManyToOne(() => Lesson, lesson => lesson.quizzes, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'lesson_id' })
	lesson: Lesson;
}
