import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './enitities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UsersModule } from '#/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Notification]), UsersModule],
    providers: [NotificationService],
    controllers: [NotificationController]
})
export class NotificationModule {}
