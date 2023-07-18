import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateTravelDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nama: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    deskripsi: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lokasi: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false
    })
    gambar?: Express.Multer.File;
}