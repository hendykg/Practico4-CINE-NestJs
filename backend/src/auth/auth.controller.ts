import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AppAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { UsuarioAutenticado } from '../common/app.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  registrar(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('me')
  @UseGuards(AppAuthGuard)
  me(@CurrentUser() usuario: UsuarioAutenticado) {
    return this.authService.me(usuario);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AppAuthGuard)
  logout(@Req() request: { authToken: string }) {
    return this.authService.logout(request.authToken);
  }
}
