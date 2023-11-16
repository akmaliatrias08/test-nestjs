import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '#/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
            secretOrKey: "TopSecret2023" 
        })
    }

    async validate(payload: any){
        const isExistUser = await this.usersRepository.findOne({ where: {id: payload.id }})

        if (!isExistUser){
            throw new HttpException({
                statusCode: HttpStatus.UNAUTHORIZED, 
                message: "token is invalid"
            }, HttpStatus.UNAUTHORIZED)
        }

        const { password, salt, ...result } = isExistUser

        return result
    }
}