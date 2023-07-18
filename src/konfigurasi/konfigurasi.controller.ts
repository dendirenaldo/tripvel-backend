import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpsertKonfigurasiDto, QueryKonfigurasiDto } from './dto';
import { KonfigurasiService } from './konfigurasi.service';

@ApiBearerAuth()
@ApiTags('Konfigurasi')
@Controller('konfigurasi')
export class KonfigurasiController {
    constructor(private konfigurasiService: KonfigurasiService) { }

    @Get()
    findAll(@Query() query: QueryKonfigurasiDto) {
        return this.konfigurasiService.findAll(query)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    upsert(@Body() data: UpsertKonfigurasiDto) {
        return this.konfigurasiService.upsert(data);
    }
}
