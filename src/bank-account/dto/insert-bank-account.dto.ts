import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InsertBankAccountDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    namaBank: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    nomorRekening: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    namaPemilik: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: true
    })
    gambar: Express.Multer.File;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    instruksi: string;
}