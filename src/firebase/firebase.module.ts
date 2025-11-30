import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Module({
  providers: [],
  exports: [],
})
export class FirebaseModule {
  constructor() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const databaseURL = process.env.FIREBASE_DATABASE_URL;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL,
    });

    console.log('🔥 Firebase Admin inicializado');
  }
}
