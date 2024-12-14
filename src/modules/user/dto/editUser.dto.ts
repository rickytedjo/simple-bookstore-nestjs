import { IsEmail, IsOptional, IsString } from "@nestjs/class-validator";

export class editUserDto {
        @IsEmail()
        @IsOptional()
        email?: string;
    
        @IsString()
        @IsOptional()
        password?: string;
    
        @IsString()
        @IsOptional()
        username?: string;
    }