import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { ArrayMinSize, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IsArray } from "sequelize-typescript";
import { JadwalType } from "src/general/jadwal.type";

export class InsertJadwalDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    travelId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    mobilId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    supirId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    asalId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    tujuanId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    tanggal: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    jamBerangkat: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    jamTiba: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    harga: number;

    @ApiProperty({ enum: JadwalType })
    @IsNotEmpty()
    @IsEnum(JadwalType)
    tipe: JadwalType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    @ArrayMinSize(0)
    kursiTerisi?: string[];
}