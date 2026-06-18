import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasService.create(createReservaDto);
  }

  @Get()
  findAll(@Query('usuarioId') usuarioId?: string) {
    if (usuarioId) {
      return this.reservasService.findPorUsuario(+usuarioId);
    }
    return this.reservasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservasService.remove(+id);
  }
}