import { IsInt, IsNotEmpty, Min } from "class-validator";


export class createTransactionItemDto{
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    transactionId : number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    bookId : number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    qty : number;
}