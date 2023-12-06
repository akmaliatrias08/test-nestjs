import { Body, Controller, Post, HttpStatus, Get, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
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

    @Post('login')
    async login(@Body() loginDto: LoginDto){
        const data = await this.authService.login(loginDto)
        
        return {
            data,
            statusCode: HttpStatus.OK, 
            message: "success"
        }
    }

    @Get('/profile')
    @UseGuards(AuthGuard('jwt'))
    profile(@Req() req){
        return req.user
    }

}
