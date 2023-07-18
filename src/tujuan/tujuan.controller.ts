import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TujuanService } from './tujuan.service';
import { InsertTujuanDto, QueryTujuanDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Tujuan')
@ApiBearerAuth()
@Controller('tujuan')
export class TujuanController {
    constructor(private tujuanService: TujuanService) { }

    @Get()
    findAll(@Query() query: QueryTujuanDto) {
        return this.tujuanService.findAll(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch()
    create(@Body() data: InsertTujuanDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.tujuanService.create(data);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param() @Body() data: InsertTujuanDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.tujuanService.create(data);
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
