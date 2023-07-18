import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Tujuan } from './tujuan.entity';
import { InsertTujuanDto, QueryTujuanDto } from './dto';
import { Op } from 'sequelize';
import { FindAllTujuanInterface } from './interface';

@Injectable()
export class TujuanService {
    constructor(
        @Inject('TUJUAN_REPOSITORY')
        private tujuanRepository: typeof Tujuan,
    ) { }

    async findAll(query: QueryTujuanDto): Promise<FindAllTujuanInterface> {
        const tujuan = await this.tujuanRepository.findAll({
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
                        namaLengkap: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        namaSingkatan: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        latitude: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        longitude: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        const jumlahData = await this.tujuanRepository.count({
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        namaLengkap: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        namaSingkatan: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        latitude: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        longitude: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                })
            }
        })
        return {
            data: tujuan,
            totalData: jumlahData,
            totalRow: tujuan.length
        }
    }

    async findOne(id: number): Promise<Tujuan> {
        const tujuan = await this.tujuanRepository.findOne({
            where: { id }
        });

        if (!tujuan) throw new UnprocessableEntityException('Tujuan not found');

        return tujuan;
    }

    async create(data: InsertTujuanDto): Promise<Tujuan> {
        return await this.tujuanRepository.create({ ...data }).then(async (res) => await this.tujuanRepository.findByPk(res.id));
    }

    async update(id: number, data: InsertTujuanDto): Promise<Tujuan> {
        const tujuan = await this.tujuanRepository.findOne({ where: { id } });

        if (!tujuan) throw new UnprocessableEntityException('Tujuan not found');

        return await this.tujuanRepository.update({ ...data }, { where: { id } }).then(async () => await this.tujuanRepository.findOne({
            where: { id }
        }));

    }

    async delete(id: number): Promise<Tujuan> {
        const tujuan = await this.tujuanRepository.findOne({ where: { id } });

        if (!tujuan) throw new UnprocessableEntityException('Tujuan not found');

        return await this.tujuanRepository.destroy({ where: { id } }).then(() => tujuan);
    }
}
