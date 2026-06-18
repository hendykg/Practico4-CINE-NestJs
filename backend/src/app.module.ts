import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PeliculasModule } from './modulos/peliculas/peliculas.module';
import { SalasModule } from './modulos/salas/salas.module';
import { FuncionesModule } from './modulos/funciones/funciones.module';
import { ReservasModule } from './modulos/reservas/reservas.module';

@Module({
  imports: [AuthModule, PeliculasModule, SalasModule, FuncionesModule, ReservasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
