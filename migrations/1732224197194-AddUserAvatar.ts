import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAvatar1732224197194 implements MigrationInterface {
    name = 'AddUserAvatar1732224197194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
