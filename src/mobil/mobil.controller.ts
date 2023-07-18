import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MobilService } from './mobil.service';
import { InsertMobilDto, QueryMobilDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Mobil')
@ApiBearerAuth()
@Controller('mobil')
export class MobilController {
    constructor(private mobilService: MobilService) { }

    @Get()
    findAll(@Query() query: QueryMobilDto) {
        return this.mobilService.findAll(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch()
    create(@Body() data: InsertMobilDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.mobilService.create(data);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param() @Body() data: InsertMobilDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.mobilService.create(data);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.mobilService.delete(+id);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.');
        }
    }
}
