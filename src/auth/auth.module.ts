import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { UsersModule } from '../users/users.module'; // 👈 NECESARIO

@Module({
  imports: [
    FirebaseModule,
    UsersModule,    // 👈 AGREGA ESTO
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
