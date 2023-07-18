import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InsertMobilDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    travelId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    merek: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    model: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    platNomor: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    warna: string;
}