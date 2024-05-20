import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InsertKursiTerisiDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    jadwalId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nomorKursi: string;
}