import { Module } from '@nestjs/common';
import { TransaksiController } from './transaksi.controller';
import { TransaksiService } from './transaksi.service';
import { TransaksiProviders } from './transaksi.providers';
import { TransaksiListProviders } from './transaksi-list.providers';
import { PromoProviders } from 'src/promo/promo.providers';
import { KonfigurasiProviders } from 'src/konfigurasi/konfigurasi.providers';

@Module({
  controllers: [TransaksiController],
  providers: [TransaksiService, ...TransaksiProviders, ...TransaksiListProviders, ...PromoProviders, ...KonfigurasiProviders]
})
export class TransaksiModule { }
