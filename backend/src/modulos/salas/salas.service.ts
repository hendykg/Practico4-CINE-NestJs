import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';

@Injectable()
export class SalasService {
  private salas = [
    { id: 1, nombre: 'Sala 1 MegaCenter', filas: 10, columnas: 12, capacidadTotal: 120 }
  ];

  create(createSalaDto: CreateSalaDto) {
    const nuevaSala = {
      id: this.salas.length + 1,
      ...createSalaDto,
      capacidadTotal: createSalaDto.filas * createSalaDto.columnas, // Regla de negocio calculada
    };
    this.salas.push(nuevaSala);
    return nuevaSala;
  }

  findAll() {
    return this.salas;
  }

  findOne(id: number) {
    const sala = this.salas.find(s => s.id === id);
    if (!sala) throw new NotFoundException(`La sala con ID #${id} no existe`);
    return sala;
  }

  update(id: number, updateSalaDto: UpdateSalaDto) {
    const index = this.salas.findIndex(s => s.id === id);
    if (index === -1) throw new NotFoundException(`La sala con ID #${id} no existe`);

    // Recalcular la capacidad por si editaron filas o columnas
    const salaActualizada = {
      ...this.salas[index],
      ...updateSalaDto,
    };
    salaActualizada.capacidadTotal = salaActualizada.filas * salaActualizada.columnas;

    this.salas[index] = salaActualizada;
    return salaActualizada;
  }

  remove(id: number) {
    const index = this.salas.findIndex(s => s.id === id);
    if (index === -1) throw new NotFoundException(`La sala con ID #${id} no existe`);
    this.salas.splice(index, 1);
    return { mensaje: `Sala #${id} eliminada correctamente` };
  }
}