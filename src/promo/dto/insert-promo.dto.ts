import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class InsertPromoDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    judul: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    deskripsi: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    tanggalBerlaku: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    minimalHarga: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber({}, { each: true })
    @ArrayMinSize(0)
    tujuanId: number[];
}