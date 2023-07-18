import { Bantuan } from './bantuan.entity';

export const BantuanProviders = [
    {
        provide: 'BANTUAN_REPOSITORY',
        useValue: Bantuan,
    },
];