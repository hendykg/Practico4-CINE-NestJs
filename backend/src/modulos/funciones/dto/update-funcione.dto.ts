import { PartialType } from '@nestjs/mapped-types';
import { CreateFuncioneDto } from './create-funcione.dto';

export class UpdateFuncioneDto extends PartialType(CreateFuncioneDto) {}
