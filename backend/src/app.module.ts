import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Usuario } from './auth/entities/auth.entity';
import { Sesion } from './auth/entities/sesion.entity';
import { CommonModule } from './common/common.module';
import { DatabaseSeederService } from './common/database-seeder.service';
import { PeliculasModule } from './modulos/peliculas/peliculas.module';
import { Pelicula } from './modulos/peliculas/entities/pelicula.entity';
import { SalasModule } from './modulos/salas/salas.module';
import { Sala } from './modulos/salas/entities/sala.entity';
import { FuncionesModule } from './modulos/funciones/funciones.module';
import { Funcion } from './modulos/funciones/entities/funcione.entity';
import { ReservasModule } from './modulos/reservas/reservas.module';
import { Reserva } from './modulos/reservas/entities/reserva.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cine.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Usuario, Sesion, Pelicula, Sala, Funcion, Reserva]),
    CommonModule,
    AuthModule,
    PeliculasModule,
    SalasModule,
    FuncionesModule,
    ReservasModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseSeederService],
})
export class AppModule {}
