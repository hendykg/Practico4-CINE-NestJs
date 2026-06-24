import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { AppAuthGuard } from '../../common/auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { UsuarioAutenticado } from '../../common/app.types';

@Controller('reservas')
@UseGuards(AppAuthGuard)
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto, @CurrentUser() usuario: UsuarioAutenticado) {
    return this.reservasService.create(createReservaDto, usuario);
  }

  @Get()
  findAll(@CurrentUser() usuario: UsuarioAutenticado) {
    return this.reservasService.findPorUsuario(usuario);
  }

  @Get('ocupados/funcion/:funcionId')
  findAsientosOcupados(@Param('funcionId') funcionId: string) {
    return this.reservasService.findAsientosOcupados(+funcionId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() usuario: UsuarioAutenticado) {
    return this.reservasService.remove(+id, usuario);
  }
}
