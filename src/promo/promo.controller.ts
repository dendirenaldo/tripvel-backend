import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PromoService } from './promo.service';
import { InsertPromoDto, QueryPromoDto } from './dto';

@ApiTags('Promo')
@ApiBearerAuth()
@Controller('promo')
export class PromoController {
    constructor(private promoService: PromoService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Query() query: QueryPromoDto, @Req() { user }: any) {
        return this.promoService.findAll(query, +user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.promoService.findOne(+id);
    }


    @UseGuards(AuthGuard('jwt'))
    @Patch()
    create(@Body() data: InsertPromoDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.promoService.create(data);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body() data: InsertPromoDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.promoService.update(+id, data);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('list/:promoListId')
    deletePromoList(@Param('promoListId') promoListId: string, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.promoService.deletePromoList(+promoListId);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.promoService.delete(+id);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }
}
