import { Module } from "@nestjs/common";
import { TransactionItemService } from "./transactionitem.service";
import { TransactionItemController } from "./transactionitem.controller";


@Module({
    providers: [TransactionItemService],
    controllers: [TransactionItemController],
})
export class TransactionItemModule {}