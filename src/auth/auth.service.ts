// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {}

  async login(idToken: string) {
    try {
      // 1️⃣ Verificar token con Firebase (ya implementado en tu FirebaseService)
      const decoded = await this.firebaseService.verifyToken(idToken);

      const email = decoded.email;
      if (!email) {
        throw new UnauthorizedException("Token inválido: no se encontró correo.");
      }

      // 2️⃣ Buscar usuario local
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException("Usuario no registrado en LogiFlex.");
      }

      if (!user.isActive) {
        throw new UnauthorizedException("Usuario desactivado. Contacte al administrador.");
      }

      // 3️⃣ Respuesta al frontend
      return {
        ok: true,
        uid: decoded.uid,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      };

    } catch (e) {
      console.log("🔥 ERROR LOGIN AUTH SERVICE >>>", e);
      throw new UnauthorizedException("Token inválido o expirado");
    }
  }
}
