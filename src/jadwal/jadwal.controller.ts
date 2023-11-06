import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JadwalService } from './jadwal.service';
import { AuthGuard } from '@nestjs/passport';
import { InsertJadwalDto, QueryJadwalDto } from './dto';

@ApiTags('Jadwal')
@ApiBearerAuth()
@Controller('jadwal')
export class JadwalController {
    constructor(private jadwalService: JadwalService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Query() query: QueryJadwalDto, @Req() { user }: any) {
        return this.jadwalService.findAll(query, user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jadwalService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch()
    create(@Body() data: InsertJadwalDto, @Req() { user }: any) {
        if (user.role === 'Admin' || user.role === 'Travel') {
            return this.jadwalService.create(data);
        } else {
            throw new ForbiddenException('Only administrator and travel can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body() data: InsertJadwalDto, @Req() { user }: any) {
        if (user.role === 'Admin' || user.role === 'Travel') {
            return this.jadwalService.update(+id, data);
        } else {
            throw new ForbiddenException('Only administrator and travel can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string, @Req() { user }: any) {
        if (user.role === 'Admin' || user.role === 'Travel') {
            return this.jadwalService.delete(+id);
        } else {
            throw new ForbiddenException('Only administrator and travel can access this endpoint.')
        }
    }
}
