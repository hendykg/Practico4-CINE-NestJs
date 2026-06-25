import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario } from './entities/auth.entity';
import { Sesion } from './entities/sesion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Sesion])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
