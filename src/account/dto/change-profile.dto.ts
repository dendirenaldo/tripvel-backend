import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { JenisKelaminType } from "src/general/jenis-kelamin.type";

export class ChangeProfileDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    namaLengkap: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    nomorPonsel: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    tanggalLahir: Date;

    @ApiProperty({ enum: JenisKelaminType })
    @IsNotEmpty()
    @IsEnum(JenisKelaminType)
    jenisKelamin: JenisKelaminType;
}