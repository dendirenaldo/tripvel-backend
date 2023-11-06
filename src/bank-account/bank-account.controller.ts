import { Body, Controller, Delete, FileTypeValidator, ForbiddenException, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Put, Query, Req, Res, StreamableFile, UnprocessableEntityException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BankAccountService } from './bank-account.service';
import { AuthGuard } from '@nestjs/passport';
import { InsertBankAccountDto, QueryBankAccountDto, UpdateBankAccountDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { Response } from 'express';

@ApiTags('Bank Account')
@ApiBearerAuth()
@Controller('bank-account')
export class BankAccountController {
    constructor(private bankAccountService: BankAccountService) { }

    @Get()
    findAll(@Query() query: QueryBankAccountDto) {
        return this.bankAccountService.findAll(query);
    }

    @Get('gambar/:id')
    async ambilGambar(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {
        let bankAccount = await this.bankAccountService.findOne(isNaN(+id) ? 0 : +id);
        if (bankAccount != null && bankAccount.gambar === null) throw new UnprocessableEntityException(`Image not found`)
        const stream = Readable.from(bankAccount.gambar);
        response.set({
            'Content-Disposition': `inline; filename="Gambar.png"`,
            'Content-Type': 'image'
        })
        return new StreamableFile(stream);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bankAccountService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar'))
    @ApiConsumes('multipart/form-data')
    @Patch()
    create(@Body() data: InsertBankAccountDto, @Req() { user }: any, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
    })) gambar: Express.Multer.File) {
        if (user.role === 'Admin') {
            return this.bankAccountService.create(data, gambar.buffer);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar'))
    @ApiConsumes('multipart/form-data')
    @Put(':id')
    update(@Param('id') id: string, @Body() data: UpdateBankAccountDto, @Req() { user }: any, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false
    })) gambar?: Express.Multer.File) {
        if (user.role === 'Admin') {
            return this.bankAccountService.update(+id, data, gambar?.buffer);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.bankAccountService.delete(+id);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }
}
