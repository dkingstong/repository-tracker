"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1746724914220 = void 0;
class Migration1746724914220 {
    constructor() {
        this.name = 'Migration1746724914220';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "githubId" integer NOT NULL, "email" character varying, "firstName" character varying, "lastName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_repository" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "repositoryId" uuid NOT NULL, "seen" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_87f2e29bdcf5f49a3dc308ddca5" PRIMARY KEY ("id", "userId", "repositoryId"))`);
        await queryRunner.query(`CREATE TABLE "repository" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "githubRepoId" integer NOT NULL, "owner" character varying NOT NULL, "name" character varying NOT NULL, "latestReleaseDescription" character varying NOT NULL, "latestReleaseVersion" character varying NOT NULL, "latestReleaseDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7eb466c21b835b08410d887d875" UNIQUE ("owner", "name"), CONSTRAINT "PK_b842c26651c6fc0b9ccd1c530e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_repository" ADD CONSTRAINT "FK_84947936c5dc156b7130ab8a358" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_repository" ADD CONSTRAINT "FK_45431d19bb5f8616630fab485c9" FOREIGN KEY ("repositoryId") REFERENCES "repository"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_repository" DROP CONSTRAINT "FK_45431d19bb5f8616630fab485c9"`);
        await queryRunner.query(`ALTER TABLE "user_repository" DROP CONSTRAINT "FK_84947936c5dc156b7130ab8a358"`);
        await queryRunner.query(`DROP TABLE "repository"`);
        await queryRunner.query(`DROP TABLE "user_repository"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
exports.Migration1746724914220 = Migration1746724914220;
