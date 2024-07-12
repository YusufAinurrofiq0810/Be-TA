import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const config = new DocumentBuilder()
    .setTitle('App example')
    .setDescription('The app API description')
    .addTag('app')
    .addSecurity('JWT', { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);

  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();