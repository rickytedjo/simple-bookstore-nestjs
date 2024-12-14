import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { createTransactionDto, editTransactionDto } from "./dto";
import { JwtGuard } from "../auth/guard";

@UseGuards(JwtGuard)
@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService){}

    @Post()
    createTransaction(@Body() dto : createTransactionDto){
        return this.transactionService.createTransaction(dto);
    }
    @Get(':id')
    getTransaction(@Param('id', ParseIntPipe) transactionId : number){
        return this.transactionService.getTransaction(transactionId);
    }
    @Get()
    getTransactions(){
        return this.transactionService.getTransactions();
    }
    @Get('items/:id')
    getTransactionItems(@Param('id', ParseIntPipe) transactionId : number){
        return this.transactionService.getTransactionItems(transactionId);
    }
    @Patch(':id')
    editTransaction(@Param('id', ParseIntPipe) transactionId : number, @Body() dto: editTransactionDto){
        return this.transactionService.editTransaction(transactionId, dto);
    }
    @Delete(':id')
    deleteTransaction(@Param('id', ParseIntPipe) transactionId : number){
        return this.transactionService.deleteTransaction(transactionId);
    }
}