import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class OrderInfoDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    pinNumber: string;

    @IsNotEmpty()
    @IsString()
    channel: string;

    @IsNotEmpty()
    @IsString()
    goodsCode: string;

    @IsNotEmpty()
    @IsString()
    goodsName: string;

    @IsNotEmpty()
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsDate()
    validStartAt: Date;

    @IsNotEmpty()
    @IsDate()
    validEndAt: Date;

    @IsOptional()
    @IsNumber()
    price?: number;
}
