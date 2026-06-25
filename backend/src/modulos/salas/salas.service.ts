import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { Sala } from './entities/sala.entity';

@Injectable()
export class SalasService {
  constructor(
    @InjectRepository(Sala)
    private readonly salasRepository: Repository<Sala>,
  ) {}

  async create(createSalaDto: CreateSalaDto) {
    const nuevaSala = this.salasRepository.create({
      ...createSalaDto,
      capacidadTotal: createSalaDto.filas * createSalaDto.columnas,
    });

    return this.salasRepository.save(nuevaSala);
  }

  findAll(): Promise<Sala[]> {
    return this.salasRepository.find();
  }

  async findOne(id: number) {
    const sala = await this.salasRepository.findOne({ where: { id } });
    if (!sala) throw new NotFoundException(`La sala con ID #${id} no existe.`);
    return sala;
  }

  async update(id: number, updateSalaDto: UpdateSalaDto) {
    const sala = await this.salasRepository.findOne({ where: { id } });
    if (!sala) throw new NotFoundException(`La sala con ID #${id} no existe.`);

    const salaActualizada = this.salasRepository.merge(sala, updateSalaDto);
    salaActualizada.capacidadTotal = salaActualizada.filas * salaActualizada.columnas;

    return this.salasRepository.save(salaActualizada);
  }

  async remove(id: number) {
    const sala = await this.salasRepository.findOne({ where: { id } });
    if (!sala) throw new NotFoundException(`La sala con ID #${id} no existe.`);

    await this.salasRepository.remove(sala);
    return { mensaje: `Sala #${id} eliminada correctamente.` };
  }
}
