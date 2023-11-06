import { ApiProperty } from "@nestjs/swagger";

export class UploadBuktiPembayaranDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: true
    })
    gambar: Express.Multer.File;
}