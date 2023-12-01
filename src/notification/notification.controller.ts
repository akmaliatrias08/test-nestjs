import { Controller, Post, Body, HttpStatus, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotifDto } from './dto/create_notif.dto';

@Controller('notification')
export class NotificationController {
    constructor(
        private notifService: NotificationService
    ){}

    @Post()
    async create(@Body() createNotifDto: CreateNotifDto){
        return {
            data: await this.notifService.create(createNotifDto), 
            statusCode: HttpStatus.CREATED, 
            message: "success"
        }
    }

    @Get("/:user_id")
    async getNotifByUser(@Param("user_id") userID: string){
        const [data, count] = await this.notifService.getNotificationByUser(userID)
        
        return {
            count,   
            data, 
            statusCode: HttpStatus.OK, 
            message: "success"
        }
    }
}
