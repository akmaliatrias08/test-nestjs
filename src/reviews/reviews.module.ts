import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviews } from './entities/reviews.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { UsersModule } from '#/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Reviews]), UsersModule],
    controllers: [ReviewsController],
    providers: [ReviewsService]
})
export class ReviewsModule {}
