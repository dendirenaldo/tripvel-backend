import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Berita } from './berita.entity';
import { InsertBeritaDto, QueryBeritaDto, UpdateBeritaDto } from './dto';
import { Auth } from 'src/auth/auth.entity';
import { Op } from 'sequelize';
import { FindAllBeritaInterface } from './interface';

@Injectable()
export class BeritaService {
    constructor(
        @Inject('BERITA_REPOSITORY')
        private beritaRepository: typeof Berita
    ) { }

    async findAll(query: QueryBeritaDto): Promise<FindAllBeritaInterface> {
        const berita = await this.beritaRepository.findAll({
            ...(query?.offset && { offset: query?.offset }),
            ...(query?.limit && { limit: query?.limit }),
            ...(query.order ? {
                order: [[query.order.index, query.order.order]]
            } : {
                order: [['createdAt', 'DESC']]
            }),
            include: [{
                model: Auth,
                as: 'auth'
            }],
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        judul: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        '$auth.nama_depan$': {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        const jumlahData = await this.beritaRepository.count({
            include: [{
                model: Auth,
                as: 'auth',
                attributes: []
            }],
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        judul: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        '$auth.nama_depan$': {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                })
            }
        })
        return {
            data: berita,
            totalData: jumlahData,
            totalRow: berita.length
        }
    }

    async findOne(id: number): Promise<Berita> {
        const berita = await this.beritaRepository.findOne({
            where: { id }, include: [{
                model: Auth,
                as: 'auth'
            }]
        });

        if (!berita) throw new UnprocessableEntityException('Berita not found');

        return berita;
    }

    async create(data: InsertBeritaDto, filename: Express.Multer.File['filename'], authId: any): Promise<Berita> {
        const { gambar, ...filteredData } = data;
        return await this.beritaRepository.create({ ...filteredData, gambar: filename, authId }, { raw: true }).then(async (res) => await this.beritaRepository.findByPk(res.id, { include: [{ model: Auth, as: 'auth' }] }));
    }

    async update(id: number, data: UpdateBeritaDto, filename?: Express.Multer.File['filename']): Promise<Berita> {
        const { gambar, ...filteredData } = data;
        const berita = await this.beritaRepository.findOne({ where: { id } });

        if (!berita) throw new UnprocessableEntityException('Berita not found');

        return await this.beritaRepository.update({ ...filteredData, ...(filename && { gambar: filename }) }, { where: { id } }).then(async () => await this.beritaRepository.findByPk(id, { include: [{ model: Auth, as: 'auth' }] }));
    }

    async delete(id: number): Promise<Berita> {
        const berita = await this.beritaRepository.findOne({ where: { id } });

        if (!berita) throw new UnprocessableEntityException('Berita not found');

        return await this.beritaRepository.destroy({ where: { id } }).then(() => berita);
    }
}
