import { PrismaService } from '../../prisma/prisma.service';
import { createTransactionDto, editTransactionDto } from "./dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionService{
    constructor(private prisma: PrismaService){}

    async createTransaction(dto:createTransactionDto){
        return await this.prisma.transaction.create({
            data : {
                ...dto
            }
        });
    }
    getTransaction(transactionId : number){
        return this.prisma.transaction.findMany({where:{
            id : transactionId
        }});
    }
    getTransactions(){
        return this.prisma.transaction.findMany({});
    }
    
    getTransactionItems(transactionId : number){
        return this.prisma.transactionItem.findMany({
            where : {
                    transactionId : transactionId
            }
        })
    }
    async editTransaction(transactionId : number,dto:editTransactionDto){
        return await this.prisma.transaction.update({
            where : {
                id : transactionId
            },
            data : {
                ...dto
            }
        });
    }
    async deleteTransaction(transactionId : number){
        return await this.prisma.transaction.delete({
            where : {
                id : transactionId
            }
        });
    }
}