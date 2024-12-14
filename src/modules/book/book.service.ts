import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../prisma/prisma.service';
import { createBookDto } from "./dto/createBook.dto";
import { editBookDto } from "./dto/editBook.dto";

@Injectable()
export class BookService{
    constructor(private prisma: PrismaService){}

    async createBook(dto: createBookDto){
        const book = await this.prisma.book.create({
            data: {
                ...dto
            }
        });

        return book;
    }
    getBook(bookId : number){
        return this.prisma.book.findMany({
            where : {
                id:bookId,
            },
        });
    }
    getBooks(){
        return this.prisma.book.findMany({});
    }
    async editBook(bookId: number ,dto: editBookDto){
        return await this.prisma.book.update({
            where : {
                id : bookId
            },
            data : {
                ...dto
            }
        });
    }
    async deleteBook(bookId: number){
        return await this.prisma.book.delete({
            where : {
                id : bookId
            }
        });
    }
}