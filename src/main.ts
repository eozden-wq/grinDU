import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function configureSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('GrinDU API')
    .setDescription('The GrinDU API documentation and description')
    .setVersion('in-dev')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  configureSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
