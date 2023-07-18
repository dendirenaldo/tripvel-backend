import { Mobil } from './mobil.entity';

export const MobilProviders = [
    {
        provide: 'MOBIL_REPOSITORY',
        useValue: Mobil,
    },
];
