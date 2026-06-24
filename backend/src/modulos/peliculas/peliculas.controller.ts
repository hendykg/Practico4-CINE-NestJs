import { 
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';
import { AppAuthGuard, RolesGuard } from '../../common/auth.guard';
import { Roles } from '../../common/roles.decorator';

const posterStorage = diskStorage({
  destination: (_req, _file, callback) => {
    mkdirSync('uploads', { recursive: true });
    callback(null, 'uploads');
  },
  filename: (_req, file, callback) => {
    const safeName = file.originalname
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase();

    callback(null, `${Date.now()}-${safeName}${extname(file.originalname)}`);
  },
});

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Post()
  @UseGuards(AppAuthGuard, RolesGuard)
  @Roles('administrador')
  @UseInterceptors(FileInterceptor('poster', { storage: posterStorage }))
  create(@Body() body: any, @UploadedFile() file: any) {
    return this.peliculasService.create({
      titulo: String(body.titulo ?? '').trim(),
      sinopsis: String(body.sinopsis ?? '').trim(),
      genero: String(body.genero ?? '').trim(),
      duracion: Number(body.duracion),
      clasificacion: String(body.clasificacion ?? '').trim(),
      imagenPoster: file ? `/uploads/${file.filename}` : '',
    });
  }

  @Get()
  findAll(
    @Query('nombre') nombre?: string,
    @Query('genero') genero?: string,
  ) {
    return this.peliculasService.findAll(nombre, genero);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peliculasService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AppAuthGuard, RolesGuard)
  @Roles('administrador')
  @UseInterceptors(FileInterceptor('poster', { storage: posterStorage }))
  update(@Param('id') id: string, @Body() body: any, @UploadedFile() file: any) {
    const updatePayload: Record<string, unknown> = {};

    if (body.titulo !== undefined) updatePayload.titulo = String(body.titulo).trim();
    if (body.sinopsis !== undefined) updatePayload.sinopsis = String(body.sinopsis).trim();
    if (body.genero !== undefined) updatePayload.genero = String(body.genero).trim();
    if (body.duracion !== undefined) updatePayload.duracion = Number(body.duracion);
    if (body.clasificacion !== undefined) updatePayload.clasificacion = String(body.clasificacion).trim();
    if (file) updatePayload.imagenPoster = `/uploads/${file.filename}`;

    return this.peliculasService.update(+id, updatePayload);
  }

  @Delete(':id')
  @UseGuards(AppAuthGuard, RolesGuard)
  @Roles('administrador')
  remove(@Param('id') id: string) {
    return this.peliculasService.remove(+id);
  }
}
