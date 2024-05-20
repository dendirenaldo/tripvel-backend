import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InsertKursiTerisiDto, QueryKursiTerisiDto } from './dto';
import { Op } from 'sequelize';
import { FindAllKursiTerisiInterface } from './interface';
import { KursiTerisi } from './kursi-terisi.entity';

@Injectable()
export class KursiTerisiService {
    constructor(
        @Inject('KURSI_TERISI_REPOSITORY')
        private kursiTerisiRepository: typeof KursiTerisi,
    ) { }

    async findAll(query: QueryKursiTerisiDto): Promise<FindAllKursiTerisiInterface> {
        const kursiTerisi = await this.kursiTerisiRepository.findAll({
            ...(query?.offset && { offset: query?.offset }),
            ...(query?.limit && { limit: query?.limit }),
            ...(query.order ? {
                order: [[query.order.index, query.order.order]]
            } : {
                order: [['createdAt', 'DESC']]
            }),
            where: {
                ...(query.jadwalId && {
                    jadwalId: query.jadwalId
                }),
                ...(query.search && {
                    [Op.or]: [{
                        nomorKursi: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        const jumlahData = await this.kursiTerisiRepository.count({
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        nomorKursi: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
                ...(query.jadwalId && {
                    jadwalId: query.jadwalId
                }),
            }
        })
        return {
            data: kursiTerisi,
            totalData: jumlahData,
            totalRow: kursiTerisi.length
        }
    }

    async findOne(id: number): Promise<KursiTerisi> {
        const kursiTerisi = await this.kursiTerisiRepository.findOne({
            where: { id }
        });

        if (!kursiTerisi) throw new UnprocessableEntityException('KursiTerisi not found');

        return kursiTerisi;
    }

    async create(data: InsertKursiTerisiDto): Promise<KursiTerisi> {
        return await this.kursiTerisiRepository.create({ ...data }, { raw: true }).then(async (res) => await this.kursiTerisiRepository.findByPk(res.id));
    }

    async update(id: number, data: InsertKursiTerisiDto): Promise<KursiTerisi> {
        const kursiTerisi = await this.kursiTerisiRepository.findOne({ where: { id } });

        if (!kursiTerisi) throw new UnprocessableEntityException('KursiTerisi not found');

        return await this.kursiTerisiRepository.update({ ...data }, { where: { id } }).then(async () => await this.kursiTerisiRepository.findOne({
            where: { id }
        }));

    }

    async delete(id: number): Promise<KursiTerisi> {
        const kursiTerisi = await this.kursiTerisiRepository.findOne({ where: { id } });

        if (!kursiTerisi) throw new UnprocessableEntityException('KursiTerisi not found');

        return await this.kursiTerisiRepository.destroy({ where: { id } }).then(() => kursiTerisi);
    }
}
