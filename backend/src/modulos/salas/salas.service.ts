import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { DataStoreService } from '../../common/data-store.service';

@Injectable()
export class SalasService {
  constructor(private readonly dataStore: DataStoreService) {}

  create(createSalaDto: CreateSalaDto) {
    const nuevaSala = {
      id: this.dataStore.nextId(this.dataStore.getSalas()),
      ...createSalaDto,
      capacidadTotal: createSalaDto.filas * createSalaDto.columnas,
    };

    this.dataStore.getSalas().push(nuevaSala);
    return nuevaSala;
  }

  findAll() {
    return this.dataStore.getSalas();
  }

  findOne(id: number) {
    const sala = this.dataStore.getSalas().find((s) => s.id === id);
    if (!sala) throw new NotFoundException(`La sala con ID #${id} no existe.`);
    return sala;
  }

  update(id: number, updateSalaDto: UpdateSalaDto) {
    const salas = this.dataStore.getSalas();
    const index = salas.findIndex((s) => s.id === id);
    if (index === -1) throw new NotFoundException(`La sala con ID #${id} no existe.`);

    const salaActualizada = {
      ...salas[index],
      ...updateSalaDto,
    };
    salaActualizada.capacidadTotal = salaActualizada.filas * salaActualizada.columnas;

    salas[index] = salaActualizada;
    return salaActualizada;
  }

  remove(id: number) {
    const salas = this.dataStore.getSalas();
    const funciones = this.dataStore.getFunciones();
    const reservas = this.dataStore.getReservas();
    const index = salas.findIndex((s) => s.id === id);

    if (index === -1) throw new NotFoundException(`La sala con ID #${id} no existe.`);

    const funcionesDeSala = funciones.filter((funcion) => funcion.salaId === id).map((funcion) => funcion.id);

    for (let i = reservas.length - 1; i >= 0; i -= 1) {
      if (funcionesDeSala.includes(reservas[i].funcionId)) {
        reservas.splice(i, 1);
      }
    }

    for (let i = funciones.length - 1; i >= 0; i -= 1) {
      if (funciones[i].salaId === id) {
        funciones.splice(i, 1);
      }
    }

    salas.splice(index, 1);
    return { mensaje: `Sala #${id} eliminada correctamente.` };
  }
}
