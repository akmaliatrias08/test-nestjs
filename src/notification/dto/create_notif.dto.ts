import { IsNotEmpty, UUIDVersion } from "class-validator"

export class CreateNotifDto {
    @IsNotEmpty()
    title: string 

    @IsNotEmpty()
    message: string

    pathAction: string

    @IsNotEmpty()
    senderId: string
    
    @IsNotEmpty()
    receiverId: string
}