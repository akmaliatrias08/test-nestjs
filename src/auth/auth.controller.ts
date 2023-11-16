import { Controller, Post, Get, Body, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService, 
    ){}

    @Post('/register')
    async register(@Body() registerDto: RegisterDto){
        const data = await this.authService.register(registerDto)

        return {
            data, 
            statusCode: HttpStatus.CREATED, 
            message: "success"
        }
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto){
        const data = await this.authService.login(loginDto)

        return {
            data, 
            statusCode: HttpStatus.OK, 
            message: "success"
        }
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    getWithAuth(@Req() req){
        return req.user
    }
}
