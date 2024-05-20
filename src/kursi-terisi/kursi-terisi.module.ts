import { Module } from '@nestjs/common';
import { KursiTerisiController } from './kursi-terisi.controller';
import { KursiTerisiService } from './kursi-terisi.service';
import { KursiTerisiProviders } from './kursi-terisi.providers';

@Module({
  controllers: [KursiTerisiController],
  providers: [KursiTerisiService, ...KursiTerisiProviders]
})
export class KursiTerisiModule { }
