import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InsertKategoriDto, QueryKategoriDto } from './dto';
import { Op } from 'sequelize';
import { FindAllKategoriInterface } from './interface';
import { Kategori } from './kategori.entity';

@Injectable()
export class KategoriService {
    constructor(
        @Inject('KATEGORI_REPOSITORY')
        private kategoriRepository: typeof Kategori,
    ) { }

    async findAll(query: QueryKategoriDto): Promise<FindAllKategoriInterface> {
        const kategori = await this.kategoriRepository.findAll({
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
        const jumlahData = await this.kategoriRepository.count({
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
            data: kategori,
            totalData: jumlahData,
            totalRow: kategori.length
        }
    }

    async findOne(id: number): Promise<Kategori> {
        const kategori = await this.kategoriRepository.findOne({
            where: { id }
        });

        if (!kategori) throw new UnprocessableEntityException('Kategori not found');

        return kategori;
    }

    async create(data: InsertKategoriDto): Promise<Kategori> {
        return await this.kategoriRepository.create({ ...data }, { raw: true }).then(async (res) => await this.kategoriRepository.findByPk(res.id));
    }

    async update(id: number, data: InsertKategoriDto): Promise<Kategori> {
        const kategori = await this.kategoriRepository.findOne({ where: { id } });

        if (!kategori) throw new UnprocessableEntityException('Kategori not found');

        return await this.kategoriRepository.update({ ...data }, { where: { id } }).then(async () => await this.kategoriRepository.findOne({
            where: { id }
        }));

    }

    async delete(id: number): Promise<Kategori> {
        const kategori = await this.kategoriRepository.findOne({ where: { id } });

        if (!kategori) throw new UnprocessableEntityException('Kategori not found');

        return await this.kategoriRepository.destroy({ where: { id } }).then(() => kategori);
    }
}
