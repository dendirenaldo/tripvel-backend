import { Kategori } from './kategori.entity';

export const KategoriProviders = [
    {
        provide: 'KATEGORI_REPOSITORY',
        useValue: Kategori,
    },
];