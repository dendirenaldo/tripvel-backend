import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Mobil } from './mobil.entity';
import { InsertMobilDto, QueryMobilDto } from './dto';
import { Op } from 'sequelize';
import { FindAllMobilInterface } from './interface';

@Injectable()
export class MobilService {
    constructor(
        @Inject('MOBIL_REPOSITORY')
        private mobilRepository: typeof Mobil,
    ) { }

    async findAll(query: QueryMobilDto): Promise<FindAllMobilInterface> {
        const mobil = await this.mobilRepository.findAll({
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
                        merek: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        model: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        platNomor: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        warna: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        const jumlahData = await this.mobilRepository.count({
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        merek: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        model: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        platNomor: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        warna: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                })
            }
        })
        return {
            data: mobil,
            totalData: jumlahData,
            totalRow: mobil.length
        }
    }

    async findOne(id: number): Promise<Mobil> {
        const mobil = await this.mobilRepository.findOne({
            where: { id }
        });

        if (!mobil) throw new UnprocessableEntityException('Mobil not found');

        return mobil;
    }

    async create(data: InsertMobilDto): Promise<Mobil> {
        return await this.mobilRepository.create({ ...data }).then(async (res) => await this.mobilRepository.findByPk(res.id));
    }

    async update(id: number, data: InsertMobilDto): Promise<Mobil> {
        const mobil = await this.mobilRepository.findOne({ where: { id } });

        if (!mobil) throw new UnprocessableEntityException('Mobil not found');

        return await this.mobilRepository.update({ ...data }, { where: { id } }).then(async () => await this.mobilRepository.findOne({
            where: { id }
        }));
    }

    async delete(id: number): Promise<Mobil> {
        const mobil = await this.mobilRepository.findOne({ where: { id } });

        if (!mobil) throw new UnprocessableEntityException('Mobil not found');

        return await this.mobilRepository.destroy({ where: { id } }).then(() => mobil);
    }
}
