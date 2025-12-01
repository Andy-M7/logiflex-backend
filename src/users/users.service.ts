import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly firebase: FirebaseService,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // ========================================
  // 🔧 NORMALIZAR ROLES QUE VIENEN DEL FRONT
  // ========================================
  private normalizeRole(role: string): UserRole {
    const map: Record<string, UserRole> = {
      'Administrador': 'ADMIN',
      'Supervisor': 'SUPERVISOR',
      'Logística': 'OPERARIO',
      'Operaciones': 'OPERARIO',
      'ADMIN': 'ADMIN',
      'SUPERVISOR': 'SUPERVISOR',
      'OPERARIO': 'OPERARIO',
    };

    return map[role] ?? 'OPERARIO';
  }

  // ========================================
  // CREATE USER
  // ========================================
  async create(dto: CreateUserDto) {
    try {
      const { email, password, name, role } = dto;

      const roleNormalized = this.normalizeRole(role);

      // Firebase
      const firebaseRecord = await this.firebase.createUser(email, password, name);
      await this.firebase.setUserRole(firebaseRecord.uid, roleNormalized);

      // BD
      const newUser = this.usersRepo.create({
        email,
        name,
        password,
        role: roleNormalized,
        isActive: true,
      });

      await this.usersRepo.save(newUser);

      return {
        message: 'Usuario creado en Firebase y BD',
        firebaseUid: firebaseRecord.uid,
        email,
        role: roleNormalized,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Error al crear usuario');
    }
  }

  // ========================================
  // GET ALL USERS
  // ========================================
  async findAll() {
    return this.usersRepo.find();
  }

  // ========================================
  // UPDATE USER
  // ========================================
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Normalizar rol si viene del front
    if (dto.role) {
      dto.role = this.normalizeRole(dto.role);
    }

    // Merge seguro
    Object.assign(user, dto);

    return await this.usersRepo.save(user);
  }

  // ========================================
  // ACTIVAR / DESACTIVAR
  // ========================================
  async activate(id: string) {
    const result = await this.usersRepo.update(id, { isActive: true });
    if (result.affected === 0) throw new NotFoundException("Usuario no encontrado");
    return { message: "Usuario activado" };
  }

  async deactivate(id: string) {
    const result = await this.usersRepo.update(id, { isActive: false });
    if (result.affected === 0) throw new NotFoundException("Usuario no encontrado");
    return { message: "Usuario desactivado" };
  }

  async delete(id: string) {
  const user = await this.usersRepo.findOne({ where: { id }});
  if (!user) throw new NotFoundException("Usuario no encontrado");

  await this.usersRepo.remove(user);

  return { message: "Usuario eliminado" };
}

// src/users/users.service.ts
async findByEmail(email: string) {
  return this.usersRepo.findOne({
    where: { email: email.toLowerCase() }
  });
}


}
