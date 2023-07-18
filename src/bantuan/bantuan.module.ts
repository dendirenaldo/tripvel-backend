import { Module } from '@nestjs/common';
import { BantuanController } from './bantuan.controller';
import { BantuanService } from './bantuan.service';
import { BantuanProviders } from './bantuan.providers';

@Module({
  controllers: [BantuanController],
  providers: [BantuanService, ...BantuanProviders]
})
export class BantuanModule { }
