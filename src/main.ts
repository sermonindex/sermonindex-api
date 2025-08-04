import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get<ConfigService>(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SermonIndex API')
    .setDescription(
      `SermonIndex is an open-source project and is available to all for free use.<br/><br/>
      You can read more about our copying permissions <a href="https://sermonindex.net/md/copying-permissions">here</a>`,
    )
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'Api-Key')
    .build();
  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      defaultModelsExpandDepth: 10,
      defaultModelExpandDepth: 10,
      persistAuthorization: true,
      layout: 'BaseLayout',
    },
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    `/${appConfig.GLOBAL_PREFIX}/api`,
    app,
    documentFactory,
    swaggerCustomOptions,
  );

  app.setGlobalPrefix(appConfig.GLOBAL_PREFIX);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({ origin: true });

  await app.listen(3000);
}
bootstrap();
