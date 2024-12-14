import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";

export class createUserDto {
        @IsEmail()
        @IsNotEmpty()
        email: string;
    
        @IsString()
        @IsNotEmpty()
        password: string;
    
        @IsString()
        @IsNotEmpty()
        username: string;
    }