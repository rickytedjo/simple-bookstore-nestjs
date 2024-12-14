import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { UserService } from "./user.service";
import { createUserDto } from "./dto/createUser.dto";
import { editUserDto } from "./dto/editUser.dto";

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    
        @Post()
        createUser(@Body() dto: createUserDto){
            return this.userService.createUser(dto);
        }

        @Get(':id')
        getUser(
            @Param('id', ParseIntPipe) userId : number 
        ){userId
            return this.userService.getUser(userId);
        }

        @Get()
        getUsers(){
            return this.userService.getUsers();
        }

        @Patch(':id')
        editUser(
            @Param('id', ParseIntPipe) userId : number ,
            @Body() dto : editUserDto
        ){
            return this.userService.editUser(userId, dto);
        }
        
        @Delete(':id')
        deleteUser(
            @Param('id', ParseIntPipe) userId : number 
        ){
            return this.userService.deleteUser(userId);
        }
}