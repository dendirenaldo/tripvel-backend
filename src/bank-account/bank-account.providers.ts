import { BankAccount } from './bank-account.entity';

export const BankAccountProviders = [
    {
        provide: 'BANK_ACCOUNT_REPOSITORY',
        useValue: BankAccount,
    },
];