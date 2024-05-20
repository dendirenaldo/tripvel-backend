import { Module } from '@nestjs/common';
import { JadwalController } from './jadwal.controller';
import { JadwalService } from './jadwal.service';
import { JadwalProviders } from './jadwal.providers';
import { KursiTerisiProviders } from 'src/kursi-terisi/kursi-terisi.providers';

@Module({
  controllers: [JadwalController],
  providers: [JadwalService, ...JadwalProviders, ...KursiTerisiProviders]
})
export class JadwalModule { }
