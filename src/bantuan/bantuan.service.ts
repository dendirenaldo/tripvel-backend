import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InsertBantuanDto, QueryBantuanDto } from './dto';
import { Op } from 'sequelize';
import { FindAllBantuanInterface } from './interface';
import { Bantuan } from './bantuan.entity';

@Injectable()
export class BantuanService {
    constructor(
        @Inject('BANTUAN_REPOSITORY')
        private bantuanRepository: typeof Bantuan,
    ) { }

    async findAll(query: QueryBantuanDto): Promise<FindAllBantuanInterface> {
        const bantuan = await this.bantuanRepository.findAll({
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
        const jumlahData = await this.bantuanRepository.count({
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
            data: bantuan,
            totalData: jumlahData,
            totalRow: bantuan.length
        }
    }

    async findOne(id: number): Promise<Bantuan> {
        const bantuan = await this.bantuanRepository.findOne({
            where: { id }
        });

        if (!bantuan) throw new UnprocessableEntityException('Bantuan not found');

        return bantuan;
    }

    async create(data: InsertBantuanDto): Promise<Bantuan> {
        return await this.bantuanRepository.create({ ...data }, { raw: true }).then(async (res) => await this.bantuanRepository.findByPk(res.id));
    }

    async update(id: number, data: InsertBantuanDto): Promise<Bantuan> {
        const bantuan = await this.bantuanRepository.findOne({ where: { id } });

        if (!bantuan) throw new UnprocessableEntityException('Bantuan not found');

        return await this.bantuanRepository.update({ ...data }, { where: { id } }).then(async () => await this.bantuanRepository.findOne({
            where: { id }
        }));

    }

    async delete(id: number): Promise<Bantuan> {
        const bantuan = await this.bantuanRepository.findOne({ where: { id } });

        if (!bantuan) throw new UnprocessableEntityException('Bantuan not found');

        return await this.bantuanRepository.destroy({ where: { id } }).then(() => bantuan);
    }
}
