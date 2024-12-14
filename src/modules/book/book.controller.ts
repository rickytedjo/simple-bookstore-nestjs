import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { BookService } from "./book.service";
import { createBookDto } from "./dto/createBook.dto";
import { editBookDto } from "./dto/editBook.dto";
import { JwtGuard } from "../auth/guard";

@UseGuards(JwtGuard)
@Controller('book')
export class BookController{
    constructor(private bookService: BookService){}

    @Post()
    createBook(@Body() dto: createBookDto){
        return this.bookService.createBook(dto);
    }
    @Get(':id')
    getBook(
        @Param('id', ParseIntPipe) bookId : number 
    ){
        return this.bookService.getBook(bookId);
    }
    @Get()
    getBooks(){
        return this.bookService.getBooks();
    }
    @Patch(':id')
    editBook(
        @Param('id', ParseIntPipe) bookId : number ,
        @Body() dto : editBookDto
    ){
        return this.bookService.editBook(bookId, dto);
    }
    @Delete(':id')
    deleteBook(
        @Param('id', ParseIntPipe) bookId : number 
    ){
        return this.bookService.deleteBook(bookId);
    }
}