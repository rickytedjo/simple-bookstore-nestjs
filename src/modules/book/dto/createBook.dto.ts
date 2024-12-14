import { IsNotEmpty, IsNumberString, IsOptional, IsString, Matches } from "@nestjs/class-validator";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class createBookDto{
    @IsNotEmpty()
    @IsString()
    title : string;

    
    @IsNumber()
    @IsNotEmpty() 
    price: number;

    @IsOptional()
    @IsString()
    desc : string;
}