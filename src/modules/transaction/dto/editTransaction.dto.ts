import { IsInt, IsISO8601, IsNotEmpty, IsOptional, Min } from "class-validator";

export class editTransactionDto {
    @IsOptional()
    @IsISO8601()
    purchaseDate: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    userId : number;

    @IsOptional()
    @IsInt()
    @Min(0)
    total : number;
}