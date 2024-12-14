import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from '../../prisma/prisma.service';
import { AuthDto } from "./dto";
import { hash, verify } from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RegDto } from "./dto/reg.dto";

@Injectable()
export class AuthService{
    constructor(
        private prisma: PrismaService,
        private jwt :JwtService,
        private config: ConfigService
    ){}

    async signToken(
        userId: number,
        email: string,
    ): Promise<{ access_token : string}>
    {
        const payload = {
            sub: userId,
            email,
        }

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn : '20m',
                secret: secret
            }
        );

        return {
            access_token: token
        };
    };

    async signup(dto: RegDto){
        const hashed = await hash(dto.password);

        try {
            const user = await this.prisma.user.create({
                data : {
                    username: dto.username,
                    email: dto.email,
                    password: hashed
                }
            });

            return this.signToken(user.id, user.email);
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                throw new ForbiddenException(
                    'Credentials taken'
                );
            }
            throw error;
        }
    }
    async signin(dto: AuthDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email : dto.email
            },
        });

        if(!user){
            throw new ForbiddenException(
                'Credentials Incorrect'
            );
        }

        const pw_match = await verify(
            user.password,
            dto.password
        );

        if(!pw_match){
            throw new ForbiddenException(
                'Credentials Incorrect'
            );
        }

        return this.signToken(user.id, user.email);
    }
}