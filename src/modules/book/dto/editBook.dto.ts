import { IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator";
import { IsNumber } from "class-validator";

export class editBookDto{
    @IsString()
    @IsOptional()
    title?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    desc?: string;
}