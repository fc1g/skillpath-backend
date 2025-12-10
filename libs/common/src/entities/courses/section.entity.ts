import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { Course } from '@app/common/entities/courses/course.entity';
import { Lesson } from '@app/common/entities/courses/lesson.entity';
import { Challenge } from '@app/common/entities/courses/challenge.entity';

@ObjectType()
@Entity('sections')
@Index('idx_section_course_order', ['course', 'order'], { unique: true })
export class Section extends AbstractEntity<Section> {
	@Field()
	@Column('varchar', { length: 255, unique: true })
	title: string;

	@Field(() => Int)
	@Column('int', { default: 0 })
	order: number;

	@Field(() => Course)
	@Index('idx_section_course', ['course'])
	@ManyToOne(() => Course, course => course.sections, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'course_id' })
	course: Course;

	@Field(() => [Lesson])
	@OneToMany(() => Lesson, lesson => lesson.section, {
		cascade: true,
	})
	lessons: Lesson[];

	@Field(() => [Challenge])
	@OneToMany(() => Challenge, challenge => challenge.section, {
		cascade: true,
	})
	challenges: Challenge[];
}
