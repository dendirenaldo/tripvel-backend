import { Body, Controller, FileTypeValidator, ForbiddenException, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { Observable, of } from 'rxjs';
import path, { extname, join } from 'path';
import { ChangeLocationDto, ChangePasswordDto, ChangePhotoProfileDto, ChangeProfileDto, InsertAccountDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { QueryAccountDto } from './dto/query-account.dto';
import { RoleType } from 'src/general/role.type';

@ApiBearerAuth()
@ApiTags('Current Account Information')
@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Query() query: QueryAccountDto, @Req() { user }: any) {
        if (user.role === 'Admin' || user.role === 'Travel') {
            return this.accountService.findAll(query, user);
        } else {
            throw new ForbiddenException('Only administrator and travel can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    me(@Req() { user }: any) {
        return this.accountService.me(+user.id);
    }

    @Get('email-verification/:token')
    emailVerificationAction(@Param('token') token: any) {
        return this.accountService.emailVerificationAction(+token);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':userId')
    findOne(@Param('userId') userId: string, @Req() { user }: any) {
        if (user.role === 'Admin' || user.role === 'Travel') {
            return this.accountService.findOne(+userId, user);
        } else {
            throw new ForbiddenException('Only administrator and travel can access this endpoint.')
        }
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('email-verification')
    emailVerification(@Req() { user }: any) {
        return this.accountService.emailVerification(user);
    }

    @Get('/foto-profil/:filename')
    getPhotoProfile(@Param('filename') filename: string, @Res() res): Observable<Object> {
        let directory = join(process.cwd(), 'uploads/foto-profil/' + filename);
        if (!fs.existsSync(directory)) directory = join(process.cwd(), 'uploads/error.png');
        return of(res.sendFile(directory));
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/foto-profil',
            filename: (req, file, callback) => {
                const uniqueSuffix =
                    Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                const filename = `${file.originalname} - ${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Patch()
    create(@Body() data: InsertAccountDto, @Req() { user }: any, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 2048000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
    })) gambar?: Express.Multer.File) {
        if (user.role === 'Admin' || (user.role === 'Travel' && (data.role === RoleType.Travel || data.role === RoleType.Supir)) && data.travelId === user.travelId) {
            return this.accountService.create(data, gambar?.filename);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('change-profile')
    changeProfile(@Body() data: ChangeProfileDto, @Req() { user }: any) {
        return this.accountService.changeProfile(data, +user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/foto-profil',
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
    @Put('change-photo-profile')
    changePhotoProfile(@Body() _: ChangePhotoProfileDto, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 2048000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
    })) gambar: Express.Multer.File, @Req() { user }: any) {
        return this.accountService.changePhotoProfile(gambar.filename, +user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('change-password')
    changePassword(@Body() data: ChangePasswordDto, @Req() { user }: any) {
        return this.accountService.changePassword(data, user.id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('change-location')
    async changeLocation(@Body() data: ChangeLocationDto, @Req() { user }: any) {
        if (user.role === RoleType.Supir) {
            return this.accountService.changeLocation(+user.id, data);
        } else {
            throw new ForbiddenException('Only supir can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/foto-profil',
            filename: (req, file, callback) => {
                const uniqueSuffix =
                    Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                const filename = `${file.originalname} - ${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: InsertAccountDto, @Req() { user }: any, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 10240000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
    })) gambar?: Express.Multer.File) {
        if (user.role === 'Admin' || (user.role === 'Travel' && (data.role === RoleType.Travel || data.role === RoleType.Supir)) && data.travelId === user.travelId) {
            return this.accountService.update(+id, data, gambar?.filename);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }
}
