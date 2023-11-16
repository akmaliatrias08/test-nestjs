import { CreateUserDto } from '#/users/dto/create-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { User } from '#/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ){}

    async register(registerDto: RegisterDto){
        try {
            //generate the salt 
            const generateSalt = await bcrypt.genSalt();

            //hast password 
            const hash = await bcrypt.hash(registerDto.password, generateSalt);

            const user = new User
            user.firstName = registerDto.firstName
            user.lastName = registerDto.lastName
            user.username = registerDto.username
            user.salt = generateSalt
            user.password = hash

            const create = await this.usersRepository.insert(user)

            const userCreated =  await this.usersRepository.findOneOrFail({
                where: { id: create.identifiers[0].id }
            })

            const { salt, password, ...result } = userCreated
            
            return result
        } catch (e) {
            if(e instanceof EntityNotFoundError){
                throw new HttpException({
                    statusCode: HttpStatus.NOT_FOUND, 
                    message: "data not found"
                }, HttpStatus.NOT_FOUND)
            } else {
                throw e
            }
        }

    }

    async login(loginDto: LoginDto){
        try {
            //findByUsername
            const user = await this.usersRepository.findOneOrFail({
                where: { username: loginDto.username }
            })

            if (!user){
                throw new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST, 
                    message: "username not found"
                }, HttpStatus.BAD_REQUEST)
            }

            //is given password valid 
            const isMatch = await bcrypt.compare(loginDto.password, user.password);

            if(!isMatch){
                throw new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST, 
                    message: "password not match"
                }, HttpStatus.BAD_REQUEST)
            }

            //return jwt token
            const payload = {
                id: user.id,
                username: user.username
            }

            return {
                accessToken: this.jwtService.sign(payload)
            }   
        } catch (e) {
            throw e
        }
    }
}
