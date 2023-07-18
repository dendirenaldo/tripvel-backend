import { Module } from '@nestjs/common';
import { BeritaController } from './berita.controller';
import { BeritaService } from './berita.service';
import { BeritaProviders } from './berita.providers';

@Module({
  controllers: [BeritaController],
  providers: [BeritaService, ...BeritaProviders]
})
export class BeritaModule { }
