import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
  ) {}

  // Acceso al sistema de autenticación
  auth() {
    return this.firebaseApp.auth();
  }

  // Crear usuario
  async createUser(email: string, password: string, displayName: string) {
    return this.auth().createUser({
      email,
      password,
      displayName,
    });
  }

  // Asignar claims (roles)
  async setUserRole(uid: string, role: string) {
    return this.auth().setCustomUserClaims(uid, { role });
  }

  // Verificar token del frontend
  async verifyToken(idToken: string) {
    return this.auth().verifyIdToken(idToken, true);
  }
}
