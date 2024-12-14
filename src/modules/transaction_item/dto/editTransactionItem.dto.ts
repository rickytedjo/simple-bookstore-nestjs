import { IsInt, IsOptional, Min } from "class-validator";


export class editTransactionItemDto{
    @IsOptional()
    @IsInt()
    @Min(0)
    transactionId : number;

    @IsOptional()
    @IsInt()
    @Min(0)
    bookId : number;

    @IsOptional()
    @IsInt()
    @Min(0)
    qty : number;
}