import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InsertBankAccountDto, QueryBankAccountDto, UpdateBankAccountDto } from './dto';
import { Op } from 'sequelize';
import { FindAllBankAccountInterface } from './interface';
import { BankAccount } from './bank-account.entity';

@Injectable()
export class BankAccountService {
    constructor(
        @Inject('BANK_ACCOUNT_REPOSITORY')
        private bankAccountRepository: typeof BankAccount,
    ) { }

    async findAll(query: QueryBankAccountDto): Promise<FindAllBankAccountInterface> {
        const bankAccount = await this.bankAccountRepository.findAll({
            ...(query?.offset && { offset: query?.offset }),
            ...(query?.limit && { limit: query?.limit }),
            ...(query.order ? {
                order: [[query.order.index, query.order.order]]
            } : {
                order: [['createdAt', 'DESC']]
            }),
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        nama: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        const jumlahData = await this.bankAccountRepository.count({
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        nama: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                })
            }
        })
        return {
            data: bankAccount,
            totalData: jumlahData,
            totalRow: bankAccount.length
        }
    }

    async findOne(id: number): Promise<BankAccount> {
        const bankAccount = await this.bankAccountRepository.findOne({
            where: { id }
        });

        if (!bankAccount) throw new UnprocessableEntityException('bankAccount not found');

        return bankAccount;
    }

    async create(data: InsertBankAccountDto, gambar: Express.Multer.File['buffer']): Promise<BankAccount> {
        return await this.bankAccountRepository.create({
            ...data,
            gambar
        }, { raw: true }).then(async (res) => await this.bankAccountRepository.findByPk(res.id));
    }

    async update(id: number, data: UpdateBankAccountDto, gambar?: Express.Multer.File['buffer']): Promise<BankAccount> {
        const bankAccount = await this.bankAccountRepository.findOne({ where: { id } });

        if (!bankAccount) throw new UnprocessableEntityException('bankAccount not found');

        return await this.bankAccountRepository.update({
            ...data,
            gambar: gambar !== null ? gambar : bankAccount.gambar
        }, { where: { id } }).then(async () => await this.bankAccountRepository.findOne({
            where: { id }
        }));

    }

    async delete(id: number): Promise<BankAccount> {
        const bankAccount = await this.bankAccountRepository.findOne({ where: { id } });

        if (!bankAccount) throw new UnprocessableEntityException('bankAccount not found');

        return await this.bankAccountRepository.destroy({ where: { id } }).then(() => bankAccount);
    }
}
