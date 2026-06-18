import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateFuncioneDto } from './dto/create-funcione.dto';
import { UpdateFuncioneDto } from './dto/update-funcione.dto';

@Injectable()
export class FuncionesService {
  // SOLUCIÓN: Declaramos explícitamente que es un arreglo flexible para objetos en memoria
  private funciones: any[] = [];

  create(createFuncioneDto: CreateFuncioneDto) {
    const inicioNueva = new Date(createFuncioneDto.fechaHora);
    const finNueva = new Date(inicioNueva.getTime() + 120 * 60000); // Estimación estándar de 2 horas

    // Validar superposición de horarios en la misma sala
    const cruce = this.funciones.find(f => {
      if (f.salaId !== createFuncioneDto.salaId) return false;
      const fInicio = new Date(f.fechaHora);
      const fFin = new Date(fInicio.getTime() + 120 * 60000);
      return (inicioNueva < fFin && finNueva > fInicio);
    });

    if (cruce) throw new BadRequestException('Horario superpuesto en la misma sala.');

    const nueva = { 
      id: this.funciones.length + 1, 
      ...createFuncioneDto, 
      fechaHora: inicioNueva 
    };
    
    this.funciones.push(nueva);
    return nueva;
  }

  findAll() { 
    return this.funciones; 
  }

  findOne(id: number) {
    const f = this.funciones.find(f => f.id === id);
    if (!f) throw new NotFoundException('Función no encontrada');
    return f;
  }

  update(id: number, updateFuncioneDto: UpdateFuncioneDto) {
    const index = this.funciones.findIndex(f => f.id === id);
    if (index === -1) throw new NotFoundException('Función no encontrada');
    
    this.funciones[index] = { ...this.funciones[index], ...updateFuncioneDto };
    return this.funciones[index];
  }

  remove(id: number) {
    const index = this.funciones.findIndex(f => f.id === id);
    if (index === -1) throw new NotFoundException('Función no encontrada');
    
    this.funciones.splice(index, 1);
    return { eliminado: true };
  }
}