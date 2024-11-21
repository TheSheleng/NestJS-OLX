import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAbstratcEntity1732210970850 implements MigrationInterface {
    name = 'AddAbstratcEntity1732210970850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deletedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`deletedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`ad\` ADD \`deletedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD \`deletedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`admin_action\` ADD \`deletedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`ad_image\` ADD \`deletedAt\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ad_image\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`admin_action\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`ad\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deletedAt\``);
    }

}
