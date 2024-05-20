import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { ArrayMinSize, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    tanggalBerlakuHingga?: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    minimalHarga: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    diskon: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber({}, { each: true })
    @ArrayMinSize(0)
    tujuanId: number[];
}