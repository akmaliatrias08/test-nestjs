import { Controller, Get, HttpStatus, Post, ParseUUIDPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Body, Param, Put, Delete } from '@nestjs/common/decorators';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(
        private reviewsService: ReviewsService
    ){}

    @Get()
    async getAll(){
        const [data, count] = await this.reviewsService.findAll();

        return {
            data, 
            count, 
            statusCode: HttpStatus.OK, 
            message: "success"
        }
    }

    @Get("/:id")
    async getDetailById(@Param('id', ParseUUIDPipe) id: string){
        return {
            data: await this.reviewsService.findOneById(id), 
            StatusCode: HttpStatus.OK, 
            message: "success"
        }
    }

    @Post()
    async create(@Body() createReviewDto: CreateReviewDto){
        const data = await this.reviewsService.create(createReviewDto);

        return {
            data, 
            statusCode: HttpStatus.CREATED,
            message: "success",

        }
    }

    @Put("/:id")
    async update(@Param("id", ParseUUIDPipe) id: string, @Body() updateReviewDto: UpdateReviewDto){
        const data = await this.reviewsService.update(id, updateReviewDto)

        return {
            data, 
            StatusCode: HttpStatus.OK, 
            message: "success"
        }
    }

    @Delete("/:id")
    async softDelete(@Param("id", ParseUUIDPipe) id: string){
        return {
            StatusCode: HttpStatus.OK, 
            message: await this.reviewsService.softDeleteById(id)
        }
    }
}
