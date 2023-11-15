import { PartialType } from "@nestjs/swagger";
import { CreateReviewDto } from "./create-review.dto";
import { IsNotEmpty, IsInt } from "class-validator";

export class UpdateReviewDto {
    @IsNotEmpty()
    @IsInt()
    rating: number;
    
    @IsNotEmpty()
    text: string;
}