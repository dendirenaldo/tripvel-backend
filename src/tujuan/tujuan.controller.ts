import { Body, Controller, Delete, FileTypeValidator, ForbiddenException, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TujuanService } from './tujuan.service';
import { InsertTujuanDto, QueryGetLokasi, QueryTujuanDto, UpdateTujuanDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Observable, of } from 'rxjs';
import * as fs from 'fs';

@ApiTags('Tujuan')
@ApiBearerAuth()
@Controller('tujuan')
export class TujuanController {
    constructor(private tujuanService: TujuanService) { }

    @Get()
    findAll(@Query() query: QueryTujuanDto) {
        return this.tujuanService.findAll(query);
    }

    @Get('gambar/:id')
    async ambilGambar(@Param('id') id: string, @Res() res): Promise<Observable<Object>> {
        let tujuan = await this.tujuanService.findOne(isNaN(+id) ? 0 : +id);
        let directory = join(process.cwd(), 'uploads/tujuan/' + tujuan.gambar);
        if (!fs.existsSync(directory)) directory = join(process.cwd(), 'uploads/error.png');
        return of(res.sendFile(directory));
    }

    @Get('favorit')
    favorit(@Param('id') id: string) {
        return this.tujuanService.favorit();
    }

    @Get('lokasi')
    getLokasi(@Query() query: QueryGetLokasi) {
        return this.tujuanService.getLokasi(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tujuanService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/tujuan',
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
    @Patch()
    create(@Body() data: InsertTujuanDto, @Req() { user }: any, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 5120000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
    })) gambar: Express.Multer.File) {
        if (user.role === 'Admin') {
            return this.tujuanService.create(data, gambar.filename);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/tujuan',
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
    @Put(':id')
    update(@Param() id: string, @Body() data: UpdateTujuanDto, @Req() { user }: any, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 5120000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
    })) gambar?: Express.Multer.File) {
        if (user.role === 'Admin') {
            return this.tujuanService.update(+id, data, gambar?.filename);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.tujuanService.delete(+id);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.');
        }
    }
}
