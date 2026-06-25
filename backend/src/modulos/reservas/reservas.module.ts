import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { Reserva } from './entities/reserva.entity';
import { Funcion } from '../funciones/entities/funcione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Funcion])],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}
