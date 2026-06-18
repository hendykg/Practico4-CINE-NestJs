import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuncionesService } from './funciones.service';
import { FuncionesController } from './funciones.controller';
import { Funcion } from './entities/funcione.entity';
import { Pelicula } from '../peliculas/entities/pelicula.entity';

@Module({
  imports: [ ],
  controllers: [FuncionesController],
  providers: [FuncionesService],
})
export class FuncionesModule {}