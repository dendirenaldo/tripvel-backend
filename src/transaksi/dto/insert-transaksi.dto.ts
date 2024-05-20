import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { MetodePembayaranType } from "src/general/metode-pembayaran.type";

export class InsertTransaksiDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    jadwalId: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    bankAccountId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    promoId?: number;

    @ApiProperty({ enum: MetodePembayaranType })
    @IsNotEmpty()
    @IsEnum(MetodePembayaranType)
    metodePembayaran?: MetodePembayaranType;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    harga: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    biayaLayanan?: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
    latitude: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
    longitude: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    alamat: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    alamatTambahan: string;

    @ValidateNested({ each: true })
    @IsArray()
    @ArrayMinSize(0)
    @Type(() => TransaksiListDto)
    transaksiList: TransaksiListDto[];
}

class TransaksiListDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    namaLengkap: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nomorKursi: string;
}