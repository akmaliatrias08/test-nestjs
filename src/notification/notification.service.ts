import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './enitities/notification.entity';
import { Repository } from 'typeorm';
import { CreateNotifDto } from './dto/create_notif.dto';
import { UsersService } from '#/users/users.service';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        private userService: UsersService
    ){}

    async create(createNotifDto: CreateNotifDto){
        try {
           //sender
            const sender = await this.userService.findOne(createNotifDto.senderId)

            //receiver
            const receiver = await this.userService.findOne(createNotifDto.receiverId)

            const notif = new Notification
            notif.title = createNotifDto.title
            notif.message = createNotifDto.message
            notif.pathAction = createNotifDto.pathAction  
            notif.sender = sender
            notif.receiver = receiver

            const createNotif = await this.notificationRepository.insert(notif)
            return this.notificationRepository.findOneOrFail({
                where: { id: createNotif.identifiers[0].id },
            }); 
        } catch (e) {
            return e
        }
    }

    async getNotificationByUser(userID: string){
        try {
            const user = await this.userService.findOne(userID)

            return this.notificationRepository.findAndCount({
                where: { 
                    receiver: {
                        id: user.id
                    }
                }   
            })
        } catch (e) {
            return e
        }
    }
}
