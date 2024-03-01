import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import * as glob from 'glob';
config();

const configService = new ConfigService();

const entityPaths = glob.sync(__dirname + '/src/entities/*.entity.ts');

const migrationPaths = glob.sync(__dirname + '/migrations/*.ts');

const entities = entityPaths
  .map((filePath) => require(filePath))
  .map((value) => value[Object.keys(value)[0]]);

const migrations = migrationPaths
  .map((filePath) => require(filePath))
  .map((value) => value[Object.keys(value)[0]]);

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities,
  migrations,
});
