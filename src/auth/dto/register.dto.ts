import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { JenisKelaminType } from "src/general/jenis-kelamin.type";

export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    namaLengkap: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    nomorPonsel: number;

    @ApiProperty({ enum: JenisKelaminType })
    @IsNotEmpty()
    @IsEnum(JenisKelaminType)
    jenisKelamin: JenisKelaminType;
}