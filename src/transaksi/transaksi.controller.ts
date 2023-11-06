import { Body, Controller, Delete, FileTypeValidator, ForbiddenException, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TransaksiService } from './transaksi.service';
import { InsertTransaksiDto, QueryTransaksiDto, UploadBuktiPembayaranDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Observable, of } from 'rxjs';
import * as fs from 'fs';

@ApiTags('Transaksi')
@ApiBearerAuth()
@Controller('transaksi')
export class TransaksiController {
    constructor(private transaksiService: TransaksiService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Query() query: QueryTransaksiDto, @Req() { user }: any) {
        return this.transaksiService.findAll(query, user);
    }

    @Get('/bukti-pembayaran/:filename')
    getPhotoProfile(@Param('filename') filename: string, @Res() res): Observable<Object> {
        let directory = join(process.cwd(), 'uploads/bukti-pembayaran/' + filename);
        if (!fs.existsSync(directory)) directory = join(process.cwd(), 'uploads/error.png');
        return of(res.sendFile(directory));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transaksiService.findOne(+id);
    }


    @UseGuards(AuthGuard('jwt'))
    @Patch()
    create(@Body() data: InsertTransaksiDto, @Req() { user }: any) {
        if (user.role === 'Pelanggan') {
            return this.transaksiService.create(data, +user.id);
        } else {
            throw new ForbiddenException('Only pelanggan can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/bukti-pembayaran',
            filename: (req, file, callback) => {
                const uniqueSuffix =
                    Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${file.originalname} - ${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Put('bukti-pembayaran/:id')
    uploadBuktiPembayaran(@Param('id') id: string, @Body() _: UploadBuktiPembayaranDto, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 3072000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
    })) gambar: Express.Multer.File, @Req() { user }: any) {
        if (user.role === 'Pelanggan') {
            return this.transaksiService.uploadBuktiPembayaran(+id, gambar.filename, +user.id);
        } else {
            throw new ForbiddenException('Only pelanggan can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('batalkan/:id')
    batal(@Param('id') id: string, @Req() { user }: any) {
        if (user.role === 'Pelanggan') {
            return this.transaksiService.batal(+id, +user.id);
        } else {
            throw new ForbiddenException('Only pelanggan can access this endpoint.')
        }
    }

    // @UseGuards(AuthGuard('jwt'))
    // @Put(':id')
    // update(@Param('id') id: string, @Body() data: InsertTransaksiDto, @Req() { user }: any) {
    //     if (user.role === 'Admin') {
    //         return this.transaksiService.update(+id, data);
    //     } else {
    //         throw new ForbiddenException('Only administrator can access this endpoint.')
    //     }
    // }

    @UseGuards(AuthGuard('jwt'))
    @Delete('list/:transaksiListId')
    deletetransaksiList(@Param('transaksiListId') transaksiListId: string, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.transaksiService.deleteTransaksiList(+transaksiListId);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.transaksiService.delete(+id);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }
}
