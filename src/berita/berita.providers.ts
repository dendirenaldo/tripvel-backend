import { Berita } from './berita.entity';

export const BeritaProviders = [
    {
        provide: 'BERITA_REPOSITORY',
        useValue: Berita,
    },
];
