import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateTujuanDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    namaLengkap: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    namaSingkatan: string;

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
    deskripsi: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false
    })
    gambar?: Express.Multer.File;
}