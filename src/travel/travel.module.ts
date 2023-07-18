import { Module } from '@nestjs/common';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';
import { TravelProviders } from './travel.providers';

@Module({
  controllers: [TravelController],
  providers: [TravelService, ...TravelProviders]
})
export class TravelModule { }
