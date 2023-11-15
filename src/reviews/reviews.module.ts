import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviews } from './entities/reviews.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Reviews])]
})
export class ReviewsModule {}
