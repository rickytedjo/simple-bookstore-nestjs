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
        return this.prisma.user.findMany();
    }
    async editUser(userId : number, dto: editUserDto){
        const updateData: any = {};

        if (dto.email) updateData.email = dto.email;
        if (dto.password) updateData.password = await hash(dto.password);
        if (dto.username) updateData.username = dto.username;

        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null)
        );
    
        if (Object.keys(filteredData).length === 0) {
            throw new Error('No valid fields provided to update');
        }

        return await this.prisma.user.update({
            where : {
                id : userId
            },
            data : {
                ...updateData
            }
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