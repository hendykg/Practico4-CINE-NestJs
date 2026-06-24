import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { FuncionesService } from './funciones.service';
import { CreateFuncioneDto } from './dto/create-funcione.dto';
import { UpdateFuncioneDto } from './dto/update-funcione.dto';
import { AppAuthGuard, RolesGuard } from '../../common/auth.guard';
import { Roles } from '../../common/roles.decorator';

@Controller('funciones')
export class FuncionesController {
  constructor(private readonly funcionesService: FuncionesService) {}

  @Post()
  @UseGuards(AppAuthGuard, RolesGuard)
  @Roles('administrador')
  create(@Body() createFuncioneDto: CreateFuncioneDto) {
    return this.funcionesService.create(createFuncioneDto);
  }

  @Get()
  findAll(@Query('peliculaId') peliculaId?: string) {
    return this.funcionesService.findAll(peliculaId ? +peliculaId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.funcionesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AppAuthGuard, RolesGuard)
  @Roles('administrador')
  update(@Param('id') id: string, @Body() updateFuncioneDto: UpdateFuncioneDto) {
    return this.funcionesService.update(+id, updateFuncioneDto);
  }

  @Delete(':id')
  @UseGuards(AppAuthGuard, RolesGuard)
  @Roles('administrador')
  remove(@Param('id') id: string) {
    return this.funcionesService.remove(+id);
  }
}
