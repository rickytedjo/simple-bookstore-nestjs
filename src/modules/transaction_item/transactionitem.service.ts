import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../prisma/prisma.service';
import { createTransactionItemDto, editTransactionItemDto } from "./dto";

@Injectable()
export class TransactionItemService {
    constructor(private prisma: PrismaService){}

    async createTransactionItem(dto:createTransactionItemDto){
        const book = this.prisma.book.findFirst({
            where : {
                id : dto.bookId
            }
        });

        const subtotal = (await book).price * dto.qty

        const temp = this.prisma.transactionItem.create({
            data : {
                transactionId : dto.transactionId,
                bookId : dto.bookId,
                qty : dto.qty,
                subtotal : subtotal
            }
        });

        await this.prisma.transaction.update({
            where : {
                id : dto.transactionId
            },
            data : {
                total : {
                    increment: subtotal
                }
            }
        })
        return temp;
    }
    getTransactionItem(transactionItemId : number){
        return this.prisma.transactionItem.findFirst({
            where : {
                id : transactionItemId
            }
        });
    }
    getTransactionItems(){
        return this.prisma.transactionItem.findMany({})
    }
    async editTransactionItem(transactionItemId: number, dto : editTransactionItemDto){
        const { transactionId, bookId, qty } = dto;
        const updateData: any = {};
        if (transactionId) updateData.transactionId = transactionId;
        if (bookId) updateData.bookId = bookId;
        if (qty) updateData.qty = qty;

        const book = await this.prisma.book.findFirst({
            where : {
                id : dto.bookId
            }
        });

        const old = await this.prisma.transactionItem.findFirst({
            where : {
                id : transactionItemId
            }
        });
        

        let subtotal = (bookId) ? book.price : old.subtotal / old.qty;
        subtotal *= (qty) ? qty : old.qty;

        updateData.subtotal = subtotal;
        
        

        if(transactionId){
            if(transactionId != old.transactionId){
                await this.prisma.transaction.update({
                    where : {
                        id : old.transactionId
                    },
                    data : {
                        total : {
                            decrement : old.subtotal
                        }
                    }
                })
                await this.prisma.transaction.update({
                    where : {
                        id : transactionId
                    },
                    data : {
                        total : {
                            increment : subtotal
                        }
                    }
                })
        }}
        else {
            await this.prisma.transaction.update({
                where : {
                    id : old.transactionId
                },
                data : {
                    total : {
                        increment : subtotal- old.subtotal,
                    }
                }
            })
        }

        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null)
        );
    
        if (Object.keys(filteredData).length === 0) {
            throw new Error('No valid fields provided to update');
        }

        const temp = await this.prisma.transactionItem.update({
            where : {
                id : transactionItemId
            },
            data : {
                ...updateData
            }

        })

        return temp;

    }
    async deleteTransactionItem(transactionItemId: number){
        const item = await this.prisma.transactionItem.findFirst({
            where: {
                id: transactionItemId
            }
        })

        await this.prisma.transaction.update({
            where : {
                id : (await item).transactionId
            },
            data : {
                total : {
                    decrement: (await item).subtotal
                }
            }
        })

        return await this.prisma.transactionItem.delete({
            where : {
                id : transactionItemId
            }
        })
    }
}