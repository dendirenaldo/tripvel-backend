import { Body, Controller, Delete, FileTypeValidator, ForbiddenException, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Put, Query, Req, Res, StreamableFile, UnprocessableEntityException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TravelService } from './travel.service';
import { InsertTravelDto, QueryTravelDto, UpdateTravelDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Observable, of } from 'rxjs';
import * as fs from 'fs';
import { Readable } from 'stream';
import { Response } from 'express';

@ApiTags('Travel')
@ApiBearerAuth()
@Controller('travel')
export class TravelController {
    constructor(private travelService: TravelService) { }

    @Get()
    findAll(@Query() query: QueryTravelDto) {
        return this.travelService.findAll(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.travelService.findOne(+id);
    }

    @Get('gambar/:id')
    async ambilGambar(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {
        let travel = await this.travelService.findOne(isNaN(+id) ? 0 : +id);
        if (travel != null && travel.gambar === null) throw new UnprocessableEntityException(`Image not found`)
        const stream = Readable.from(travel.gambar);
        response.set({
            'Content-Disposition': `inline; filename="Gambar.png"`,
            'Content-Type': 'image'
        })
        return new StreamableFile(stream);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar'))
    @ApiConsumes('multipart/form-data')
    @Patch()
    create(@Body() data: InsertTravelDto, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
    })) gambar: Express.Multer.File, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.travelService.create(data, gambar.buffer);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar'))
    @ApiConsumes('multipart/form-data')
    @Put(':id')
    update(@Param('id') id: string, @Body() data: UpdateTravelDto, @Req() { user }: any, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false
    })) gambar?: Express.Multer.File) {
        if (user.role === 'Admin') {
            return this.travelService.update(+id, data, gambar?.buffer);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.travelService.delete(+id);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }
}
