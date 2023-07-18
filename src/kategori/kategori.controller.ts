import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KategoriService } from './kategori.service';
import { AuthGuard } from '@nestjs/passport';
import { InsertKategoriDto, QueryKategoriDto } from './dto';

@ApiTags('Kategori')
@ApiBearerAuth()
@Controller('kategori')
export class KategoriController {
    constructor(private kategoriService: KategoriService) { }

    @Get()
    findAll(@Query() query: QueryKategoriDto) {
        return this.kategoriService.findAll(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.kategoriService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch()
    create(@Body() data: InsertKategoriDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.kategoriService.create(data);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body() data: InsertKategoriDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.kategoriService.update(+id, data);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.kategoriService.delete(+id);
    }
}
