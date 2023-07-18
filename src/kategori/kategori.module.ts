import { Module } from '@nestjs/common';
import { KategoriController } from './kategori.controller';
import { KategoriService } from './kategori.service';
import { KategoriProviders } from './kategori.providers';

@Module({
  controllers: [KategoriController],
  providers: [KategoriService, ...KategoriProviders]
})
export class KategoriModule { }
