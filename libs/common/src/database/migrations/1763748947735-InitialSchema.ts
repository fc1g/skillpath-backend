import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1763748947735 implements MigrationInterface {
	name = 'InitialSchema1763748947735';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."challenge_progress_status" AS ENUM('attempted', 'passed', 'failed')`,
		);
		await queryRunner.query(
			`CREATE TABLE "challenge_attempts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."challenge_progress_status" NOT NULL, "submitted_code" text NOT NULL, "attempts" integer NOT NULL DEFAULT '1', "test_results" text NOT NULL, "user_id" uuid NOT NULL, "challenge_id" uuid NOT NULL, "attempted_at" TIMESTAMP WITH TIME ZONE, "completed_at" TIMESTAMP WITH TIME ZONE, "course_progress_id" uuid, CONSTRAINT "PK_ec04be45a63caa94d1d3d0d681e" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_3ed6dab084a2053c5d3a1c7231" ON "challenge_attempts" ("user_id", "challenge_id") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."roles_name_enum" AS ENUM('user', 'admin')`,
		);
		await queryRunner.query(
			`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" "public"."roles_name_enum" NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `,
		);
		await queryRunner.query(
			`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "password" character varying, "username" character varying(30), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."provider_type" AS ENUM('github', 'google')`,
		);
		await queryRunner.query(
			`CREATE TABLE "oauth_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "provider" "public"."provider_type" NOT NULL, "provider_id" character varying NOT NULL, "username" character varying(255), "email" character varying(255) NOT NULL, "user_id" uuid, CONSTRAINT "uq_oauth_user_provider" UNIQUE ("user_id", "provider"), CONSTRAINT "PK_710a81523f515b78f894e33bb10" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_22a05e92f51a983475f9281d3b" ON "oauth_accounts" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_283c974372e384adfc2c51ae18" ON "oauth_accounts" ("provider", "provider_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_420d9f679d41281f282f5bc7d0" ON "categories" ("slug") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."course_level" AS ENUM('beginner', 'intermediate', 'advanced')`,
		);
		await queryRunner.query(
			`CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "subtitle" character varying(255) NOT NULL, "description" text NOT NULL, "slug" character varying(255) NOT NULL, "requirements" text array NOT NULL, "learning_outcomes" text array NOT NULL, "included_features" text array NOT NULL, "level" "public"."course_level" NOT NULL DEFAULT 'beginner', "average_rating" double precision NOT NULL DEFAULT '0', "ratings_count" integer NOT NULL DEFAULT '0', "students_count" integer NOT NULL DEFAULT '0', "lessons_count" integer NOT NULL DEFAULT '0', "challenges_count" integer NOT NULL DEFAULT '0', "duration_seconds" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_a3bb2d01cfa0f95bc5e034e1b7" ON "courses" ("slug") `,
		);
		await queryRunner.query(
			`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(64) NOT NULL, "slug" character varying(64) NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_b3aa10c29ea4e61a830362bd25" ON "tags" ("slug") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."quiz_type" AS ENUM('single-choice', 'multiple-choice')`,
		);
		await queryRunner.query(
			`CREATE TABLE "quizzes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "question" text NOT NULL, "type" "public"."quiz_type" NOT NULL DEFAULT 'single-choice', "options" text array NOT NULL, "correct_option_index" integer NOT NULL, "explanation" text, "order" integer NOT NULL DEFAULT '0', "lesson_id" uuid, CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "idx_quiz_lesson_order" ON "quizzes" ("lesson_id", "order") `,
		);
		await queryRunner.query(
			`CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "order" integer NOT NULL DEFAULT '0', "content" text NOT NULL, "duration_seconds" integer NOT NULL DEFAULT '0', "course_id" uuid NOT NULL, "section_id" uuid, CONSTRAINT "UQ_3dad32ba0ff20feee98b1b0c43d" UNIQUE ("title"), CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "idx_lesson_section_order" ON "lessons" ("section_id", "order") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."challenge_difficulty" AS ENUM('easy', 'medium', 'hard')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."challenge_language" AS ENUM('javascript', 'typescript')`,
		);
		await queryRunner.query(
			`CREATE TABLE "challenges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "path" character varying(64) NOT NULL, "title" character varying(255) NOT NULL, "instructions" text NOT NULL, "requirements" text array NOT NULL, "example" text NOT NULL, "templateCode" text NOT NULL, "difficulty" "public"."challenge_difficulty" NOT NULL, "language" "public"."challenge_language" NOT NULL, "order" integer NOT NULL DEFAULT '0', "expected_output" text, "expected_structure" text, "course_id" uuid NOT NULL, "section_id" uuid, CONSTRAINT "UQ_40aec9fdb0c582eaa651adc3f05" UNIQUE ("path"), CONSTRAINT "PK_1e664e93171e20fe4d6125466af" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_challenge_section" ON "challenges" ("section_id") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "idx_challenge_section_order" ON "challenges" ("section_id", "order") `,
		);
		await queryRunner.query(
			`CREATE TABLE "sections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "order" integer NOT NULL DEFAULT '0', "course_id" uuid, CONSTRAINT "UQ_c673c8ef8cac3fe461b73297f36" UNIQUE ("title"), CONSTRAINT "PK_f9749dd3bffd880a497d007e450" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_section_course" ON "sections" ("course_id") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "idx_section_course_order" ON "sections" ("course_id", "order") `,
		);
		await queryRunner.query(
			`CREATE TABLE "course_ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "course_id" uuid NOT NULL, "rating" smallint NOT NULL, "review" text, CONSTRAINT "PK_ea1fcdbcda76cdeb72ea8cf4530" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_32b68ae69d8fb9200a854d6b33" ON "course_ratings" ("course_id") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_7fdd747e5701a947bc44350d1a" ON "course_ratings" ("user_id", "course_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "challenge_drafts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" text NOT NULL, "user_id" uuid NOT NULL, "challenge_id" uuid NOT NULL, CONSTRAINT "PK_fbd643cd0b0a4bf49e3b103247b" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_86461a49fcfe4e63109f775351" ON "challenge_drafts" ("user_id", "challenge_id") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."course_progress_status" AS ENUM('enrolled', 'in-progress', 'completed')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."last_visited_item_type" AS ENUM('lesson', 'challenge')`,
		);
		await queryRunner.query(
			`CREATE TABLE "course_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."course_progress_status" NOT NULL, "completed_lessons_count" integer NOT NULL DEFAULT '0', "completed_challenges_count" integer NOT NULL DEFAULT '0', "user_id" uuid NOT NULL, "course_id" uuid NOT NULL, "last_visited_item_id" uuid, "lastVisitedItemType" "public"."last_visited_item_type", "last_accessed_at" TIMESTAMP WITH TIME ZONE, "completed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_eadd1b31d44023e533eb847c4f7" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_578f66595af7b446be0f546468" ON "course_progress" ("user_id", "course_id") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."lesson_progress_status" AS ENUM('not-started', 'completed')`,
		);
		await queryRunner.query(
			`CREATE TABLE "lesson_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."lesson_progress_status" NOT NULL, "user_id" uuid NOT NULL, "lesson_id" uuid NOT NULL, "course_progress_id" uuid, CONSTRAINT "PK_e6223ebbc5f8f5fce40e0193de1" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_f34e3a227170e0ce674e0afb58" ON "lesson_progress" ("user_id", "lesson_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "course_tags" ("course_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_aee88490b15cb29d15d9503d221" PRIMARY KEY ("course_id", "tag_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_286187640dcc13dd9b308d2d6a" ON "course_tags" ("course_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_87da401f10ecb400b2f4bfcda7" ON "course_tags" ("tag_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "course_categories" ("course_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_0fcee24a5291cf6c3de60ea670e" PRIMARY KEY ("course_id", "category_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_c961c57e9f869094eebab0d547" ON "course_categories" ("course_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_53c2e5fe2bb1ba3c21deac6a98" ON "course_categories" ("category_id") `,
		);
		await queryRunner.query(
			`ALTER TABLE "challenge_attempts" ADD CONSTRAINT "FK_b9edaab946c11666009d11bac64" FOREIGN KEY ("course_progress_id") REFERENCES "course_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "oauth_accounts" ADD CONSTRAINT "FK_22a05e92f51a983475f9281d3b0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "quizzes" ADD CONSTRAINT "FK_2cf4e4b5b533af8dc6b38d4fa9b" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "lessons" ADD CONSTRAINT "FK_19261e484ffd22b40ea596ece4d" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" ADD CONSTRAINT "FK_de255d4a5fa3e2d4f609539c849" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "sections" ADD CONSTRAINT "FK_53ccbd6e2fa20dac9062f4f4c36" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_progress" ADD CONSTRAINT "FK_468b14b39d8428b77d8630bd5cc" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "lesson_progress" ADD CONSTRAINT "FK_b451a501ce61a80a20f3dc260a1" FOREIGN KEY ("course_progress_id") REFERENCES "course_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_tags" ADD CONSTRAINT "FK_286187640dcc13dd9b308d2d6a9" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_tags" ADD CONSTRAINT "FK_87da401f10ecb400b2f4bfcda7c" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_categories" ADD CONSTRAINT "FK_c961c57e9f869094eebab0d547d" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_categories" ADD CONSTRAINT "FK_53c2e5fe2bb1ba3c21deac6a986" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "course_categories" DROP CONSTRAINT "FK_53c2e5fe2bb1ba3c21deac6a986"`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_categories" DROP CONSTRAINT "FK_c961c57e9f869094eebab0d547d"`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_tags" DROP CONSTRAINT "FK_87da401f10ecb400b2f4bfcda7c"`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_tags" DROP CONSTRAINT "FK_286187640dcc13dd9b308d2d6a9"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
		);
		await queryRunner.query(
			`ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_b451a501ce61a80a20f3dc260a1"`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_progress" DROP CONSTRAINT "FK_468b14b39d8428b77d8630bd5cc"`,
		);
		await queryRunner.query(
			`ALTER TABLE "sections" DROP CONSTRAINT "FK_53ccbd6e2fa20dac9062f4f4c36"`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" DROP CONSTRAINT "FK_de255d4a5fa3e2d4f609539c849"`,
		);
		await queryRunner.query(
			`ALTER TABLE "lessons" DROP CONSTRAINT "FK_19261e484ffd22b40ea596ece4d"`,
		);
		await queryRunner.query(
			`ALTER TABLE "quizzes" DROP CONSTRAINT "FK_2cf4e4b5b533af8dc6b38d4fa9b"`,
		);
		await queryRunner.query(
			`ALTER TABLE "oauth_accounts" DROP CONSTRAINT "FK_22a05e92f51a983475f9281d3b0"`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenge_attempts" DROP CONSTRAINT "FK_b9edaab946c11666009d11bac64"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_53c2e5fe2bb1ba3c21deac6a98"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_c961c57e9f869094eebab0d547"`,
		);
		await queryRunner.query(`DROP TABLE "course_categories"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_87da401f10ecb400b2f4bfcda7"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_286187640dcc13dd9b308d2d6a"`,
		);
		await queryRunner.query(`DROP TABLE "course_tags"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`,
		);
		await queryRunner.query(`DROP TABLE "user_roles"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_f34e3a227170e0ce674e0afb58"`,
		);
		await queryRunner.query(`DROP TABLE "lesson_progress"`);
		await queryRunner.query(`DROP TYPE "public"."lesson_progress_status"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_578f66595af7b446be0f546468"`,
		);
		await queryRunner.query(`DROP TABLE "course_progress"`);
		await queryRunner.query(`DROP TYPE "public"."last_visited_item_type"`);
		await queryRunner.query(`DROP TYPE "public"."course_progress_status"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_86461a49fcfe4e63109f775351"`,
		);
		await queryRunner.query(`DROP TABLE "challenge_drafts"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_7fdd747e5701a947bc44350d1a"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_32b68ae69d8fb9200a854d6b33"`,
		);
		await queryRunner.query(`DROP TABLE "course_ratings"`);
		await queryRunner.query(`DROP INDEX "public"."idx_section_course_order"`);
		await queryRunner.query(`DROP INDEX "public"."idx_section_course"`);
		await queryRunner.query(`DROP TABLE "sections"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx_challenge_section_order"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx_challenge_section"`);
		await queryRunner.query(`DROP TABLE "challenges"`);
		await queryRunner.query(`DROP TYPE "public"."challenge_language"`);
		await queryRunner.query(`DROP TYPE "public"."challenge_difficulty"`);
		await queryRunner.query(`DROP INDEX "public"."idx_lesson_section_order"`);
		await queryRunner.query(`DROP TABLE "lessons"`);
		await queryRunner.query(`DROP INDEX "public"."idx_quiz_lesson_order"`);
		await queryRunner.query(`DROP TABLE "quizzes"`);
		await queryRunner.query(`DROP TYPE "public"."quiz_type"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_b3aa10c29ea4e61a830362bd25"`,
		);
		await queryRunner.query(`DROP TABLE "tags"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_a3bb2d01cfa0f95bc5e034e1b7"`,
		);
		await queryRunner.query(`DROP TABLE "courses"`);
		await queryRunner.query(`DROP TYPE "public"."course_level"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_420d9f679d41281f282f5bc7d0"`,
		);
		await queryRunner.query(`DROP TABLE "categories"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_283c974372e384adfc2c51ae18"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_22a05e92f51a983475f9281d3b"`,
		);
		await queryRunner.query(`DROP TABLE "oauth_accounts"`);
		await queryRunner.query(`DROP TYPE "public"."provider_type"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
		);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"`,
		);
		await queryRunner.query(`DROP TABLE "roles"`);
		await queryRunner.query(`DROP TYPE "public"."roles_name_enum"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_3ed6dab084a2053c5d3a1c7231"`,
		);
		await queryRunner.query(`DROP TABLE "challenge_attempts"`);
		await queryRunner.query(`DROP TYPE "public"."challenge_progress_status"`);
	}
}
