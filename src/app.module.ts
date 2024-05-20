import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { AccountModule } from './account/account.module';
import { HttpModule } from '@nestjs/axios';
import { BeritaModule } from './berita/berita.module';
import { KategoriModule } from './kategori/kategori.module';
import { KonfigurasiModule } from './konfigurasi/konfigurasi.module';
import { TravelModule } from './travel/travel.module';
import { TujuanModule } from './tujuan/tujuan.module';
import { PromoModule } from './promo/promo.module';
import { JadwalModule } from './jadwal/jadwal.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { TransaksiModule } from './transaksi/transaksi.module';
import { BantuanModule } from './bantuan/bantuan.module';
import { MobilModule } from './mobil/mobil.module';
import { KursiTerisiModule } from './kursi-terisi/kursi-terisi.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    {
      ...HttpModule.register({}),
      global: true
    },
    MailModule,
    AuthModule,
    AccountModule,
    BantuanModule,
    DatabaseModule,
    KategoriModule,
    BeritaModule,
    KonfigurasiModule,
    TujuanModule,
    TravelModule,
    PromoModule,
    MobilModule,
    JadwalModule,
    BankAccountModule,
    TransaksiModule,
    KursiTerisiModule,
  ],
})
export class AppModule { }
