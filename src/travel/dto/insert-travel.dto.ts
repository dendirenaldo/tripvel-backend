import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class InsertTravelDto {
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
        required: true
    })
    gambar: Express.Multer.File;
}