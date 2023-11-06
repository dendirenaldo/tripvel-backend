import { BankAccount } from "../bank-account.entity";

export interface FindAllBankAccountInterface {
    readonly data: BankAccount[],
    readonly totalData: number,
    readonly totalRow: number,
}