import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KursiTerisiService } from './kursi-terisi.service';
import { AuthGuard } from '@nestjs/passport';
import { InsertKursiTerisiDto, QueryKursiTerisiDto } from './dto';

@ApiTags('Kursi Terisi')
@ApiBearerAuth()
@Controller('kursi-erisi')
export class KursiTerisiController {
    constructor(private kursiTerisiService: KursiTerisiService) { }

    @Get()
    findAll(@Query() query: QueryKursiTerisiDto) {
        return this.kursiTerisiService.findAll(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.kursiTerisiService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch()
    create(@Body() data: InsertKursiTerisiDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.kursiTerisiService.create(data);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body() data: InsertKursiTerisiDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.kursiTerisiService.update(+id, data);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.kursiTerisiService.delete(+id);
    }
}
