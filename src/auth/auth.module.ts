import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: "TopSecret2023",
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController]
})
export class AuthModule {}
