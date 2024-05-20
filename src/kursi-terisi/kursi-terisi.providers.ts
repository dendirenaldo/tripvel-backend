import { KursiTerisi } from './kursi-terisi.entity';

export const KursiTerisiProviders = [
    {
        provide: 'KURSI_TERISI_REPOSITORY',
        useValue: KursiTerisi,
    },
];