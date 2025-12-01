// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    console.log("BODY RECIBIDO >>> ", body);

    if (!body.idToken) {
      throw new UnauthorizedException("Token requerido");
    }

    return this.authService.login(body.idToken);
  }
}
