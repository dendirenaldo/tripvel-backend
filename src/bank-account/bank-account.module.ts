import { Module } from '@nestjs/common';
import { BankAccountController } from './bank-account.controller';
import { BankAccountService } from './bank-account.service';
import { BankAccountProviders } from './bank-account.providers';

@Module({
  controllers: [BankAccountController],
  providers: [BankAccountService, ...BankAccountProviders]
})
export class BankAccountModule { }
