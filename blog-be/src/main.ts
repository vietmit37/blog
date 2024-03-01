import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import chalk from 'chalk';
import { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import 'source-map-support';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from '@filters/all-exceptions.filter';
import { MyValidationPipe } from '@pipes/my-validation.pipe';
import { TransformResponseInterceptor } from '@interceptors/transform-response.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const allowedOrigins = ['*'];
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors({
    origin: (origin, callback) => {
      if (allowedOrigins[0].startsWith('*')) {
        return callback(null, true);
      }
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        console.info(msg, origin);
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
    exposedHeaders: ['Content-Disposition'],
  });

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new MyValidationPipe());
  app.useGlobalInterceptors(
    new TransformResponseInterceptor(app.get(Reflector)),
  );

  app.listen(configService.get('PORT') || 4000).then(() => {
    console.info(
      chalk.bold.blue(`App listen on port ${configService.get('PORT')}`),
    );
  });
}
bootstrap();
