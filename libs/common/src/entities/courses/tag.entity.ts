import { Field, ObjectType } from '@nestjs/graphql';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	Index,
	ManyToMany,
} from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { Course } from '@app/common/entities/courses/course.entity';
import slugify from 'slugify';

@ObjectType()
@Entity('tags')
@Index(['slug'], { unique: true })
export class Tag extends AbstractEntity<Tag> {
	@Field()
	@Column('varchar', { length: 64, unique: true })
	name: string;

	@Field()
	@Column('varchar', { length: 64 })
	slug: string;

	@ManyToMany(() => Course, course => course.tags)
	courses: Course[];

	@BeforeInsert()
	@BeforeUpdate()
	generateSlug() {
		if (this.name) {
			this.slug = slugify(this.name, {
				lower: true,
				strict: true,
				replacement: '-',
				locale: 'en',
			});
		}
	}
}
