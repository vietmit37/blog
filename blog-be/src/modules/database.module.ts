import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { readdirSync } from 'fs';
import { join } from 'path';

const entityPath = '../entities';
const entityFiles = readdirSync(join(__dirname, entityPath));

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          name: 'postgres',
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          entities: [
            ...(
              await Promise.all(
                entityFiles
                  .filter(
                    (entityFile) =>
                      !entityFile.includes('.map') &&
                      !entityFile.includes('.d.ts') &&
                      !entityFile.includes('mongo'),
                  )
                  .map((entityFile) => import(`../entities/${entityFile}`)),
              )
            ).map((value) => {
              return value[Object.keys(value)[0]];
            }),
          ],
          logging: ['error'],
          synchronize: true,
          extra: {
            trustServerCertificate: true,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
