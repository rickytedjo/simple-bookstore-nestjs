import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { createTransactionItemDto, editTransactionItemDto } from "./dto";
import { TransactionItemService } from "./transactionitem.service";
import { JwtGuard } from "../auth/guard";

@UseGuards(JwtGuard)
@Controller('transaction-item')
export class TransactionItemController {
    constructor(private transactionItemService : TransactionItemService){}

    @Post()
    createTransactionItem(@Body() dto : createTransactionItemDto){
        return this.transactionItemService.createTransactionItem(dto);
    }
    @Get(':id')
    getTransactionItem(@Param('id', ParseIntPipe) transactionItemId : number){
        return this.transactionItemService.getTransactionItem(transactionItemId);
    }
    @Get('')
    getTransactionItems(){
        return this.transactionItemService.getTransactionItems();
    }
    @Patch(":id")
    editTransactionItem(
        @Param('id', ParseIntPipe) transactionItemId : number,
        @Body() dto :  editTransactionItemDto
    ){
        return this.transactionItemService.editTransactionItem(transactionItemId, dto);
    }
    @Delete(":id")
    deleteTransactionItem(@Param('id', ParseIntPipe) transactionItemId : number){
        return this.transactionItemService.deleteTransactionItem(transactionItemId);
    }

}