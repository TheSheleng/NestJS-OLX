import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseTables1732208971724 implements MigrationInterface {
    name = 'BaseTables1732208971724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'user', \`name\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ad\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`price\` decimal(10,2) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(), \`ownerId\` int NULL, \`categoryId\` int NULL, INDEX \`IDX_60e59329bce691e9d31a3e3131\` (\`ownerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`sentAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(), \`senderId\` int NULL, \`receiverId\` int NULL, \`adId\` int NULL, INDEX \`IDX_bc096b4e18b1f9508197cd9806\` (\`senderId\`), INDEX \`IDX_71fb36906595c602056d936fc1\` (\`receiverId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin_action\` (\`id\` int NOT NULL AUTO_INCREMENT, \`actionType\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(), \`adminId\` int NULL, \`adId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ad_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`adId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ad\` ADD CONSTRAINT \`FK_60e59329bce691e9d31a3e3131b\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ad\` ADD CONSTRAINT \`FK_c418809c6e081f861cefe495668\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_bc096b4e18b1f9508197cd98066\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_71fb36906595c602056d936fc13\` FOREIGN KEY (\`receiverId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_45a14b7b0bac2107060dda6a8f2\` FOREIGN KEY (\`adId\`) REFERENCES \`ad\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`admin_action\` ADD CONSTRAINT \`FK_b5619f036be9e4671f834ed2154\` FOREIGN KEY (\`adminId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`admin_action\` ADD CONSTRAINT \`FK_1febfadd9c47df678d34edf6aa5\` FOREIGN KEY (\`adId\`) REFERENCES \`ad\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ad_image\` ADD CONSTRAINT \`FK_89d3713e2fefa22c53a7db848eb\` FOREIGN KEY (\`adId\`) REFERENCES \`ad\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ad_image\` DROP FOREIGN KEY \`FK_89d3713e2fefa22c53a7db848eb\``);
        await queryRunner.query(`ALTER TABLE \`admin_action\` DROP FOREIGN KEY \`FK_1febfadd9c47df678d34edf6aa5\``);
        await queryRunner.query(`ALTER TABLE \`admin_action\` DROP FOREIGN KEY \`FK_b5619f036be9e4671f834ed2154\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_45a14b7b0bac2107060dda6a8f2\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_71fb36906595c602056d936fc13\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_bc096b4e18b1f9508197cd98066\``);
        await queryRunner.query(`ALTER TABLE \`ad\` DROP FOREIGN KEY \`FK_c418809c6e081f861cefe495668\``);
        await queryRunner.query(`ALTER TABLE \`ad\` DROP FOREIGN KEY \`FK_60e59329bce691e9d31a3e3131b\``);
        await queryRunner.query(`DROP TABLE \`ad_image\``);
        await queryRunner.query(`DROP TABLE \`admin_action\``);
        await queryRunner.query(`DROP INDEX \`IDX_71fb36906595c602056d936fc1\` ON \`message\``);
        await queryRunner.query(`DROP INDEX \`IDX_bc096b4e18b1f9508197cd9806\` ON \`message\``);
        await queryRunner.query(`DROP TABLE \`message\``);
        await queryRunner.query(`DROP INDEX \`IDX_60e59329bce691e9d31a3e3131\` ON \`ad\``);
        await queryRunner.query(`DROP TABLE \`ad\``);
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
