import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../prisma/prisma.service';
import { createUserDto } from "./dto/createUser.dto";
import { editUserDto } from "./dto/editUser.dto";
import { hash } from "argon2";


@Injectable()
export class UserService{
    constructor(private prisma: PrismaService){}

    async createUser(dto: createUserDto){
        const hashed = await hash(dto.password)

        const user = await this.prisma.user.create({
            data : {
                username: dto.username,
                email: dto.email,
                password: hashed
            }
        });

        return user;
    }
    getUser(userId : number){
        return this.prisma.user.findMany({
            where : {
                id : userId
            }
        });
    }
    getUsers(){
        return this.prisma.book.findMany({});
    }
    async editUser(userId : number, dto: editUserDto){
        const { email, password, username } = dto;
        const updateData: any = {};
        if (email) updateData.email = email;
        if (password) updateData.password = hash(password);
        if (username) updateData.username = username;

        return await this.prisma.user.update({
            where : {
                id : userId
            },
            data : {
                ...updateData}
        })  
    }
    async deleteUser(userId : number){
        return await this.prisma.user.delete({
            where : {
                id: userId
            }
        })
    }
}