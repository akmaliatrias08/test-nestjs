import { User } from "#/users/entities/user.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Passport } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){
        super({
            secretOrKey: 'TOPSECRET2023', 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: any){
        try {
            //data id payload exist tidak di data user
            const userOne = this.userRepository.findOne({
                where: {id: payload.id }
            })

            if(!userOne){
                throw new HttpException({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: "token is invalid",
                }, HttpStatus.UNAUTHORIZED)
            }

            return userOne
        } catch (e) {
            throw e
        }
    }
}