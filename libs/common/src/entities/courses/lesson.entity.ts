import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { Section } from '@app/common/entities/courses/section.entity';
import { Quiz } from '@app/common/entities/courses/quiz.entity';

@ObjectType()
@Entity('lessons')
@Index('idx_lesson_section_order', ['section', 'order'], { unique: true })
export class Lesson extends AbstractEntity<Lesson> {
	@Field()
	@Column('varchar', { length: 255, unique: true })
	title: string;

	@Field(() => Int)
	@Column('int', { default: 0 })
	order: number;

	@Field()
	@Column('text')
	content: string;

	@Field(() => Int, {
		description: 'Total duration in seconds',
	})
	@Column('int', { default: 0, name: 'duration_seconds' })
	durationSeconds: number;

	@Field(() => Section)
	@ManyToOne(() => Section, section => section.lessons, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'section_id' })
	section: Section;

	@Field(() => [Quiz])
	@OneToMany(() => Quiz, quiz => quiz.lesson, {
		cascade: true,
	})
	quizzes: Quiz[];

	@Field(() => ID)
	@Column('uuid', { name: 'course_id' })
	courseId: string;
}
