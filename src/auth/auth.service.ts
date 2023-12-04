import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '#/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ){}

    async register(registerDto: RegisterDto){
        try {
            //generate salt 
            const saltGenerate = await bcrypt.genSalt()

            //hash password 
            const password = registerDto.password
            const hash = await bcrypt.hash(password, saltGenerate);

            const user = new User
            user.firstName = registerDto.firstName
            user.lastName = registerDto.lastName
            user.username = registerDto.username
            user.salt = saltGenerate
            user.password = hash

            const createUser = await this.userRepository.insert(user)

            return await this.userRepository.findOneOrFail({
                where: {id: createUser.identifiers[0].id}
            })
        } catch (e) {
          throw e  
        }
    }

    async login(loginDto: LoginDto){
        try {
            //cari data user by username 
            const userOne = await this.userRepository.findOne({
                where: {username: loginDto.username}
            })

            if(!userOne){
                throw new HttpException(
                    {
                      statusCode: HttpStatus.BAD_REQUEST,
                      error: 'username is invalid',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            //password dari data user sama ga sama loginDto.password
            const isMatch = await bcrypt.compare(loginDto.password, userOne.password);

            if(!isMatch){
                throw new HttpException(
                    {
                      statusCode: HttpStatus.BAD_REQUEST,
                      error: 'password is invalid',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            const payload = {
                id: userOne.id,
                username: userOne.username
            }

            return {
                access_token: await this.jwtService.signAsync(payload)
            }
        } catch (e) {
            throw e
        }
        
    }
}
