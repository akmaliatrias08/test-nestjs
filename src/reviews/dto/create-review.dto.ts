import { IsNotEmpty, IsInt } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    @IsInt()
    rating: number;
    
    @IsNotEmpty()
    text: string;
}