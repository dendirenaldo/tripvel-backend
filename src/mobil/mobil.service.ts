import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Mobil } from './mobil.entity';
import { InsertMobilDto, QueryMobilDto } from './dto';
import { Op } from 'sequelize';
import { FindAllMobilInterface } from './interface';
import { Sequelize } from 'sequelize-typescript';
import { Travel } from 'src/travel/travel.entity';

@Injectable()
export class MobilService {
    constructor(
        @Inject('MOBIL_REPOSITORY')
        private mobilRepository: typeof Mobil,
    ) { }

    async findAll(query: QueryMobilDto, user: any): Promise<FindAllMobilInterface> {
        const mobil = await this.mobilRepository.findAll({
            include: [{
                model: Travel,
                as: 'travel',
                attributes: ['id', 'nama']
            }],
            ...(query?.offset && { offset: query?.offset }),
            ...(query?.limit && { limit: query?.limit }),
            ...(query.order ? {
                order: [[Array.isArray(query.order.index) ? Sequelize.col(query.order.index.join('.')) : query.order.index, query.order.order]]
            } : {
                order: [['createdAt', 'DESC']]
            }),
            where: {
                ...((query.travelId || user.role === 'Travel') && {
                    travelId: user.role === 'Travel' ? user.travelId : query.travelId,
                }),
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
                ...((query.travelId || user.role === 'Travel') && {
                    travelId: user.role === 'Travel' ? user.travelId : query.travelId,
                }),
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

    async create(data: InsertMobilDto, user: any): Promise<Mobil> {
        return await this.mobilRepository.create({
            ...data,
            ...(user.role === 'Travel' && { travelId: user.travelId })
        }).then(async (res) => await this.mobilRepository.findByPk(res.id));
    }

    async update(id: number, data: InsertMobilDto, user: any): Promise<Mobil> {
        const mobil = await this.mobilRepository.findOne({
            where: {
                id,
                ...(user.role === 'Travel' && { travelId: user.travelId })
            }
        });

        if (!mobil) throw new UnprocessableEntityException('Mobil not found');

        return await this.mobilRepository.update({ ...data }, { where: { id } }).then(async () => await this.mobilRepository.findOne({
            where: { id }
        }));
    }

    async delete(id: number): Promise<Mobil> {
        const mobil = await this.mobilRepository.findOne({ where: { id } });

        if (!mobil) throw new UnprocessableEntityException('Mobil not found');

        try {
            return await this.mobilRepository.destroy({ where: { id } }).then(() => mobil);
        } catch (err) {
            if (err.name === 'SequelizeForeignKeyConstraintError') throw new UnprocessableEntityException('Mobil ini sudah terdapat jadwal, sehingga mobil ini tidak dapat dihapuskan!');
        }
    }
}
