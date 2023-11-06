import { Module } from '@nestjs/common';
import { JadwalController } from './jadwal.controller';
import { JadwalService } from './jadwal.service';
import { JadwalProviders } from './jadwal.providers';

@Module({
  controllers: [JadwalController],
  providers: [JadwalService, ...JadwalProviders]
})
export class JadwalModule { }
