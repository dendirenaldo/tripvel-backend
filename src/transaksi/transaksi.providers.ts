import { Transaksi } from './transaksi.entity';

export const TransaksiProviders = [
    {
        provide: 'TRANSAKSI_REPOSITORY',
        useValue: Transaksi,
    },
];