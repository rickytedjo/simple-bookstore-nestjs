import { IsInt, IsISO8601, IsNotEmpty, IsOptional, Min } from "class-validator";

export class createTransactionDto {
    @IsOptional()
    @IsISO8601()
    purchaseDate?: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    userId : number;

    @IsOptional()
    @IsInt()
    @Min(0)
    total : number;
}