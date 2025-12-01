import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { FirebaseService } from '../firebase/firebase.service';
import { User } from './entities/auth.entity';
import { Company } from './entities/company.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    private readonly firebaseService: FirebaseService,
  ) {}

  // --- 1. IMPLEMENTACIÓN DE FIND ALL (LISTAR) ---
  async findAll() {
    return await this.userRepo.find({
      order: { createdAt: 'DESC' }, // Ordenar por fecha de creación (más nuevos primero)
      // Opcional: Seleccionar solo campos seguros
      // select: ['id', 'email', 'fullName', 'isActive', 'createdAt'] 
    });
  }

  async register(dto: CreateAuthDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('El correo ya está registrado');

    // 1) Crear usuario en Firebase
    const fbUser = await this.firebaseService.createUser(dto);
    
    // ENCRIPTAR CONTRASEÑA
    const hashedPassword = await this.hashPassword(dto.password);

    // 2) Asegurar empresa Logisti Flex
    let company = await this.companyRepo.findOne({ where: { name: 'Logisti Flex' } });

    if (!company) {
      company = this.companyRepo.create({
        name: 'Logisti Flex',
        industry: 'Alimentos para mascotas',
      });
      await this.companyRepo.save(company);
    }

    // 3) Crear usuario interno
    const user = this.userRepo.create({
      email: dto.email,
      fullName: dto.fullName,
      firebaseUUID: fbUser.uid,
      password: hashedPassword,
      company,
    });

    await this.userRepo.save(user);

    return {
      message: 'Usuario registrado correctamente',
      user,
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userRepo.findOne({
      where: { email: loginAuthDto.email }
    });

    if (user) {
      const isMatchPassword = await this.comparePassword(loginAuthDto.password, user.password);
      if (!isMatchPassword) {
        throw new BadRequestException({
          message: 'Usuario o clave incorrecto',
          exists: false
        });
      }
      return {
        email: user.email,
        fullName: user.fullName,
        id: user.id
      };
    } else {
      throw new BadRequestException({
        message: 'Usuario o clave incorrecta',
        exists: false
      });
    }
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id }
    });

    if (user) {
      return user;
    } else {
      // Nota: Es mejor lanzar excepción para que el controlador devuelva 404
      throw new NotFoundException('Usuario no existe');
    }
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    
    // 1. Si viene una contraseña nueva, la encriptamos antes de guardar
    if (updateAuthDto.password) {
        updateAuthDto.password = await this.hashPassword(updateAuthDto.password);
    }

    const user = await this.userRepo.preload({
      id: id,
      ...updateAuthDto
    });

    if (!user) {
      throw new NotFoundException(`El usuario con id ${id} no fue encontrado.`);
    }

    await this.userRepo.save(user);
    return user;
  }

  // --- 2. IMPLEMENTACIÓN DE REMOVE (ELIMINAR) ---
  async remove(id: string) {
    const user = await this.userRepo.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`El usuario con id ${id} no fue encontrado.`);
    }
    await this.userRepo.remove(user);
    return { message: 'Usuario eliminado correctamente' };
  }

  // Encriptar
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Comparar
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async verify(dto: VerifyAuthDto) {
    const decoded = await this.firebaseService.verifyToken(dto.token);
    if (!decoded) throw new UnauthorizedException('Token inválido');

    const user = await this.userRepo.findOne({ where: { firebaseUUID: decoded.uid } });

    if (!user) throw new UnauthorizedException('Usuario no existe en BD');

    return {
      message: 'Token válido',
      user,
    };
  }
}