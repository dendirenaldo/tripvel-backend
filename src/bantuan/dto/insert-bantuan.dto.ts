import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InsertBantuanDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    pertanyaan: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    jawaban: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    prioritas: number;
}