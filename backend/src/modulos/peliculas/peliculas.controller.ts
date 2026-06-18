import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseInterceptors, 
  UploadedFile 
} from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  // 🎬 CREAR PELÍCULA CON SUBIDA DE PÓSTER (Soporta Multipart FormData desde móvil/PC)
  @Post()
  @UseInterceptors(FileInterceptor('file')) // Captura el campo 'file' que envía el FormData de React
  create(@Body() body: any, @UploadedFile() file: any) {
    // Si viene un archivo binario, guardamos su ruta; de lo contrario, asignamos una por defecto
    const rutaImagen = file ? `uploads/${file.filename}` : 'uploads/default.jpg';

    // Mapeamos los campos del body y convertimos la duración a número seguro
    const nuevaPelicula: CreatePeliculaDto = {
      titulo: body.titulo,
      sinopsis: body.sinopsis,
      genero: body.genero,
      duracion: Number(body.duracion),
      clasificacion: body.clasificacion,
      imagenPoster: rutaImagen,
    };

    return this.peliculasService.create(nuevaPelicula);
  }

  // LISTAR PELÍCULAS (Con filtros opcionales por nombre o género para la Cartelera)
  @Get()
  findAll(
    @Query('nombre') nombre?: string,
    @Query('genero') genero?: string,
  ) {
    return this.peliculasService.findAll(nombre, genero);
  }

  //OBTENER DETALLE DE UNA PELÍCULA ESPECÍFICA
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peliculasService.findOne(+id);
  }

  //EDITAR DATOS DE UNA PELÍCULA
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePeliculaDto: UpdatePeliculaDto) {
    return this.peliculasService.update(+id, updatePeliculaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.peliculasService.remove(+id);
  }
}