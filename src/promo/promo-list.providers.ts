import { PromoList } from './promo-list.entity';

export const PromoListProviders = [
  {
    provide: 'PROMO_LIST_REPOSITORY',
    useValue: PromoList,
  },
];