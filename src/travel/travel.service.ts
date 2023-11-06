import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Travel } from './travel.entity';
import { InsertTravelDto, QueryTravelDto, UpdateTravelDto } from './dto';
import { Op } from 'sequelize';
import { FindAllTravelInterface } from './interface';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TravelService {
    constructor(
        @Inject('TRAVEL_REPOSITORY')
        private travelRepository: typeof Travel
    ) { }

    async findAll(query: QueryTravelDto): Promise<FindAllTravelInterface> {
        const travel = await this.travelRepository.findAll({
            ...(query?.offset && { offset: query?.offset }),
            ...(query?.limit && { limit: query?.limit }),
            ...(query.order ? {
                order: [[Array.isArray(query.order.index) ? Sequelize.col(query.order.index.join('.')) : query.order.index, query.order.order]]
            } : {
                order: [['createdAt', 'DESC']]
            }),
            attributes: {
                exclude: ['gambar']
            },
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        id: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        nama: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        deskripsi: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        lokasi: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        const jumlahData = await this.travelRepository.count({
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        id: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        nama: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        deskripsi: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        lokasi: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                })
            }
        })
        return {
            data: travel,
            totalData: jumlahData,
            totalRow: travel.length
        }
    }

    async findOne(id: number): Promise<Travel> {
        const travel = await this.travelRepository.findOne({ where: { id } });

        if (!travel) throw new UnprocessableEntityException('Travel not found');

        return travel;
    }

    async create(data: InsertTravelDto, gambar: Buffer): Promise<Travel> {
        return await this.travelRepository.create({ ...data, gambar });
    }

    async update(id: number, data: UpdateTravelDto, gambar?: Buffer): Promise<Travel> {
        const travel = await this.travelRepository.findOne({ where: { id } });

        if (!travel) throw new UnprocessableEntityException('Travel not found');

        await this.travelRepository.update({ ...data, ...(gambar !== null && { gambar }) }, { where: { id } });
        return await this.travelRepository.findOne({ where: { id }, raw: true });
    }

    async delete(id: number): Promise<Travel> {
        const travel = await this.travelRepository.findOne({ where: { id } });

        if (!travel) throw new UnprocessableEntityException('Travel not found');

        try {
            return await this.travelRepository.destroy({ where: { id } }).then(() => travel);
        } catch (err) {
            if (err.name === 'SequelizeForeignKeyConstraintError') throw new UnprocessableEntityException('Travel ini sudah terdapat mobil atau jadwal, sehingga travel ini tidak dapat dihapuskan!');
        }

    }
}
