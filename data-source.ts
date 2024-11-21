import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [`${__dirname}/src/entity/**/*{.ts,.js}`],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  migrationsTableName: 'migration',
  synchronize: false,
});
