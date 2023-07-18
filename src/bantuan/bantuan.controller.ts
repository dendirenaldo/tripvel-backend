import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BantuanService } from './bantuan.service';
import { AuthGuard } from '@nestjs/passport';
import { InsertBantuanDto, QueryBantuanDto } from './dto';

@ApiTags('Bantuan')
@ApiBearerAuth()
@Controller('bantuan')
export class BantuanController {
    constructor(private bantuanService: BantuanService) { }

    @Get()
    findAll(@Query() query: QueryBantuanDto) {
        return this.bantuanService.findAll(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bantuanService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch()
    create(@Body() data: InsertBantuanDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.bantuanService.create(data);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body() data: InsertBantuanDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.bantuanService.update(+id, data);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.bantuanService.delete(+id);
    }
}
