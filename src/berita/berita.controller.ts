import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BeritaService } from './berita.service';
import { AuthGuard } from '@nestjs/passport';
import { InsertBeritaDto, QueryBeritaDto, UpdateBeritaDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Observable, of } from 'rxjs';
import * as fs from 'fs';

@ApiTags('Berita')
@ApiBearerAuth()
@Controller('berita')
export class BeritaController {
    constructor(private beritaService: BeritaService) { }

    @Get()
    findAll(@Query() query: QueryBeritaDto) {
        return this.beritaService.findAll(query);
    }

    @Get('gambar/:id')
    async ambilGambar(@Param('id') id: string, @Res() res): Promise<Observable<Object>> {
        let berita = await this.beritaService.findOne(isNaN(+id) ? 0 : +id);
        let directory = join(process.cwd(), 'uploads/berita/' + berita.gambar);
        if (!fs.existsSync(directory)) directory = join(process.cwd(), 'uploads/error.png');
        return of(res.sendFile(directory));
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.beritaService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/berita',
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
    create(@Body() data: InsertBeritaDto, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
    })) gambar: Express.Multer.File, @Req() { user }: any) {
        return this.beritaService.create(data, gambar.filename, +user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/berita',
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
    update(@Param('id') id: string, @Body() data: UpdateBeritaDto, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
    })) gambar?: Express.Multer.File) {
        return this.beritaService.update(+id, data, gambar?.filename);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.beritaService.delete(+id);
    }
}
