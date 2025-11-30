import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
  } from '@nestjs/common';
  import * as admin from 'firebase-admin';
  import { CreateAuthDto } from '../auth/dto/create-auth.dto';
  
  @Injectable()
  export class FirebaseService {
    async createUser(dto: CreateAuthDto) {
      try {
        return await admin.auth().createUser({
          email: dto.email,
          password: dto.password,
          displayName: dto.fullName,
        });
      } catch (error) {
        this.handleError(error);
        throw error;
      }
    }
  
    async verifyToken(token: string) {
      try {
        return await admin.auth().verifyIdToken(token);
      } catch (error) {
        this.handleError(error);
      }
    }
  
    private handleError(error: any) {
      console.log(error);
  
      if (error.code === 'auth/email-already-exists') {
        throw new BadRequestException('El correo ya existe en Firebase');
      }
  
      throw new InternalServerErrorException('Error interno con Firebase Auth');
    }
  }
  