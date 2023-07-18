import { Travel } from './travel.entity';

export const TravelProviders = [
    {
        provide: 'TRAVEL_REPOSITORY',
        useValue: Travel,
    },
];
