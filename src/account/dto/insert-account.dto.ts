import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { JenisKelaminType } from "src/general/jenis-kelamin.type";
import { RoleType } from "src/general/role.type";

export class InsertAccountDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    password?: string;

    @ApiProperty({ enum: RoleType })
    @IsNotEmpty()
    @IsEnum(RoleType)
    role: RoleType;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    namaLengkap: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
    nomorPonsel?: number;

    @ApiPropertyOptional({ enum: JenisKelaminType })
    @IsOptional()
    @IsEnum(JenisKelaminType)
    jenisKelamin?: JenisKelaminType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
    travelId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
    isActive?: boolean;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false
    })
    gambar?: Express.Multer.File;
}