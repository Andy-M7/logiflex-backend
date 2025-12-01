import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const projectId   = cfg.get<string>('FIREBASE_PROJECT_ID');
        const clientEmail = cfg.get<string>('FIREBASE_CLIENT_EMAIL');
        let privateKey    = cfg.get<string>('FIREBASE_PRIVATE_KEY');
        const storage     = cfg.get<string>('FIREBASE_STORAGE_BUCKET');
        const dbUrl       = cfg.get<string>('FIREBASE_DATABASE_URL');

        if (!projectId || !clientEmail || !privateKey) {
          throw new Error('Faltan variables FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY');
        }

        if (privateKey.includes('\\n')) privateKey = privateKey.replace(/\\n/g, '\n');

        // evita inicializar más de una vez en hot-reload/tests
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
            storageBucket: storage,
            databaseURL: dbUrl,
          });
        }
        return admin.app();
      },
    },
    FirebaseService, // <--- registra el servicio
  ],
  exports: ['FIREBASE_ADMIN', FirebaseService], // <--- expórtalo
})
export class FirebaseModule {}
