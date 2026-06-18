// src/main.ts (En tu Backend)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. SOLUCIÓN CRÍTICA: Permite que React (puerto 5173) se comunique con NestJS (puerto 3000)
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // 2. SOLUCIÓN CRÍTICA: Le añade la palabra "/api" a todas tus rutas automáticamente
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();