import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { Max, Min } from 'class-validator';

@ObjectType()
@Entity('course_ratings')
@Index(['userId', 'courseId'], { unique: true })
@Index(['courseId'])
export class CourseRating extends AbstractEntity<CourseRating> {
	@Field(() => ID)
	@Column('uuid', { name: 'user_id' })
	userId: string;

	@Field(() => ID)
	@Column('uuid', { name: 'course_id' })
	courseId: string;

	@Field(() => Int)
	@Column('smallint')
	@Min(1)
	@Max(5)
	rating: number;

	@Field(() => String, { nullable: true })
	@Column('text', { nullable: true })
	review: string | null;
}
