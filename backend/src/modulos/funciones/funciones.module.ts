import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuncionesService } from './funciones.service';
import { FuncionesController } from './funciones.controller';
import { Funcion } from './entities/funcione.entity';
import { Pelicula } from '../peliculas/entities/pelicula.entity';
import { Sala } from '../salas/entities/sala.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Funcion, Pelicula, Sala])],
  controllers: [FuncionesController],
  providers: [FuncionesService],
})
export class FuncionesModule {}
