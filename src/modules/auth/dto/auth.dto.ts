import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";


export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}