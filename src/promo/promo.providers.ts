import { Promo } from './promo.entity';

export const PromoProviders = [
    {
        provide: 'PROMO_REPOSITORY',
        useValue: Promo,
    },
];