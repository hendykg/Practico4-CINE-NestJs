import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PeliculasService {
  private peliculas = [
    {
      id: 1,
      titulo: 'Batman vs Superman',
      sinopsis: 'El enfrentamiento de dos héroes...',
      genero: 'Accion',
      duracion: 151, // minutos
      clasificacion: '+14',
      imagenPoster: 'uploads/batman.jpg'
    }
  ];

  create(nuevaPelicula: any) {
    const pelicula = { id: this.peliculas.length + 1, ...nuevaPelicula };
    this.peliculas.push(pelicula);
    return pelicula;
  }

  findAll(nombre?: string, genero?: string) {
    let resultado = [...this.peliculas];

    if (nombre) {
      resultado = resultado.filter(p => p.titulo.toLowerCase().includes(nombre.toLowerCase()));
    }
    if (genero) {
      resultado = resultado.filter(p => p.genero.toLowerCase() === genero.toLowerCase());
    }

    return resultado;
  }

  findOne(id: number) {
    const pelicula = this.peliculas.find(p => p.id === id);
    if (!pelicula) throw new NotFoundException('Película no encontrada');
    return pelicula;
  }

  update(id: number, updatePeliculaDto: any) {
    const index = this.peliculas.findIndex(p => p.id === id);
    if (index === -1) throw new NotFoundException('Película no encontrada');
    
    this.peliculas[index] = { ...this.peliculas[index], ...updatePeliculaDto };
    return this.peliculas[index];
  }

  remove(id: number) {
    const index = this.peliculas.findIndex(p => p.id === id);
    if (index === -1) throw new NotFoundException('Película no encontrada');
    
    this.peliculas.splice(index, 1);
    return { mensaje: `Película con id #${id} eliminada` };
  }

  
}