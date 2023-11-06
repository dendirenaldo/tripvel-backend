import { Jadwal } from './jadwal.entity';

export const JadwalProviders = [
    {
        provide: 'JADWAL_REPOSITORY',
        useValue: Jadwal,
    },
];