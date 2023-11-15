import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Reviews } from './entities/reviews.entity';
import { Entity, EntityNotFoundError, Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UsersService } from '#/users/users.service';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Reviews)
        private reviewsRepository: Repository<Reviews>, 
        private userService: UsersService
    ){}

    findAll(){
        return this.reviewsRepository.findAndCount({
            relations: {
                psycholog: true
            }
        });
    }

    async findOneById(id: string){
        try {
            return await this.reviewsRepository.findOneOrFail({
                where: {id}, 
                relations: {psycholog: true}
            })
        } catch (e) {
            if (e instanceof EntityNotFoundError){
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND, 
                        error: "data not found",
                    },
                    HttpStatus.NOT_FOUND
                ) 
            } else {
                throw e
            }
        }
    }

    async create(createReviewDto: CreateReviewDto){
        try {
            //cek user id is valid
            const findOneUserId = await this.userService.findOne(createReviewDto.userId)
            
            //kalau valid kita baru create review
            const reviewEntity = new Reviews
            reviewEntity.rating = createReviewDto.rating
            reviewEntity.text = createReviewDto.text
            reviewEntity.psycholog = findOneUserId

            const insertReview = await this.reviewsRepository.insert(reviewEntity)
            return await this.reviewsRepository.findOneOrFail({
                where: {
                    id: insertReview.identifiers[0].id
                }
            })
        } catch (e) {
            throw e
        }

    }

    async update(id: string, updateReviewDto: UpdateReviewDto){
        try {
            //cari id nya valid atau engga 
            await this.findOneById(id)

            //kalau valid update data nya 
            const reviewEntity = new Reviews
            reviewEntity.rating = updateReviewDto.rating
            reviewEntity.text = updateReviewDto.text

            await this.reviewsRepository.update(id, reviewEntity)

            //return data setelah di update 
            return await this.reviewsRepository.findOneOrFail({
                where: {
                    id
                }
            })
        } catch (e) {
            throw e
        }
    }
    
    async softDeleteById(id: string){
        try {
            //cari dulu id valid ga 
            await this.findOneById(id)

            //kalau nemu langsung delete 
            await this.reviewsRepository.softDelete(id)

            return "success"
        } catch (e) {
            throw e
        }
    }
}
