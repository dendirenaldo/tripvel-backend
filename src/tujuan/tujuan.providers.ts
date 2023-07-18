import { Tujuan } from './tujuan.entity';

export const TujuanProviders = [
    {
        provide: 'TUJUAN_REPOSITORY',
        useValue: Tujuan,
    },
];
