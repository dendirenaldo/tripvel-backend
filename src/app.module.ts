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
    DatabaseModule,
    KategoriModule,
    BeritaModule,
    KonfigurasiModule,
    TujuanModule,
    TravelModule,
    PromoModule
  ],
})
export class AppModule { }
