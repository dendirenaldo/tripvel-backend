import { Module } from '@nestjs/common';
import { MobilController } from './mobil.controller';
import { MobilService } from './mobil.service';
import { MobilProviders } from './mobil.providers';

@Module({
  controllers: [MobilController],
  providers: [MobilService, ...MobilProviders]
})
export class MobilModule { }
