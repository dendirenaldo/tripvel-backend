import { Module } from '@nestjs/common';
import { PromoController } from './promo.controller';
import { PromoService } from './promo.service';
import { PromoProviders } from './promo.providers';
import { PromoListProviders } from './promo-list.providers';

@Module({
  controllers: [PromoController],
  providers: [PromoService, ...PromoProviders, ...PromoListProviders]
})
export class PromoModule { }
