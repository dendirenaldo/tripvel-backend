import { Module } from '@nestjs/common';
import { TransaksiController } from './transaksi.controller';
import { TransaksiService } from './transaksi.service';
import { TransaksiProviders } from './transaksi.providers';
import { TransaksiListProviders } from './transaksi-list.providers';

@Module({
  controllers: [TransaksiController],
  providers: [TransaksiService, ...TransaksiProviders, ...TransaksiListProviders]
})
export class TransaksiModule { }
