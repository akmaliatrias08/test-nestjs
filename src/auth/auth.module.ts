import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'TOPSECRET2023',
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forFeature([User])],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  // exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
