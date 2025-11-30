import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FirebaseService } from '../firebase/firebase.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';

import { User } from './entities/auth.entity';
import { Company } from './entities/company.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    private readonly firebaseService: FirebaseService,
  ) {}

  async register(dto: CreateAuthDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('El correo ya está registrado');

    // 1) Crear usuario en Firebase
    const fbUser = await this.firebaseService.createUser(dto);

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
      company,
    });

    await this.userRepo.save(user);

    return {
      message: 'Usuario registrado correctamente',
      user,
    };
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
