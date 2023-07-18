import { Module } from '@nestjs/common';
import { TujuanController } from './tujuan.controller';
import { TujuanService } from './tujuan.service';
import { TujuanProviders } from './tujuan.providers';

@Module({
  controllers: [TujuanController],
  providers: [TujuanService, ...TujuanProviders]
})
export class TujuanModule { }
