import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateAuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() LoginAuthDto: LoginAuthDto) {
    return this.authService.login(LoginAuthDto);
  }

  @Post('verify')
  verify(@Body() dto: VerifyAuthDto) {
    return this.authService.verify(dto);
  }

  // --- RUTAS REST ESTÁNDAR (CORREGIDAS) ---

  @Get() // GET /api/v1/auth -> Lista todos
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id') // GET /api/v1/auth/:id (Quitamos 'find/')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id') // PATCH /api/v1/auth/:id (Quitamos 'edit/')
  update(@Param('id') id: string, @Body() UpdateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, UpdateAuthDto);
  }

  @Delete(':id') // DELETE /api/v1/auth/:id (Quitamos 'delete/')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}