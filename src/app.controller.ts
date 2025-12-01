// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Controller()
export class AppController {
  @Get('firebase-health')
  async health() {
    // listar buckets o claims para validar credenciales
    const projectId = (await admin.app().options.credential?.getAccessToken()) ? process.env.FIREBASE_PROJECT_ID : 'N/A';
    return { ok: true, projectId };
  }
}
