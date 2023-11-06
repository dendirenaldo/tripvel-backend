import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Tujuan } from './tujuan.entity';
import { InsertTujuanDto, QueryGetLokasi, QueryTujuanDto, UpdateTujuanDto } from './dto';
import { Op, QueryTypes } from 'sequelize';
import { FindAllTujuanInterface } from './interface';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TujuanService {
    constructor(
        @Inject('TUJUAN_REPOSITORY')
        private tujuanRepository: typeof Tujuan,

        private httpService: HttpService,
        private configService: ConfigService
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

    async favorit() {
        // return await this.tujuanRepository.sequelize.query("SELECT FROM tujuan JOIN ", { type: QueryTypes.SELECT });
    }

    async getLokasi(query: QueryGetLokasi) {
        const data = await lastValueFrom(
            this.httpService.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query.longitude},${query.latitude}.json?types=neighborhood&access_token=${this.configService.get<String>('MAPBOX_API')}`)
                .pipe(map(response => response.data))
        );
        return { placeName: data.features.length > 0 ? data.features[0]?.place_name : null };
    }

    async findOne(id: number): Promise<Tujuan> {
        const tujuan = await this.tujuanRepository.findOne({
            where: { id }
        });

        if (!tujuan) throw new UnprocessableEntityException('Tujuan not found');

        return tujuan;
    }

    async create(data: InsertTujuanDto, gambar: Express.Multer.File['filename']): Promise<Tujuan> {
        return await this.tujuanRepository.create({ ...data, gambar }).then(async (res) => await this.tujuanRepository.findByPk(res.id));
    }

    async update(id: number, data: UpdateTujuanDto, gambar?: Express.Multer.File['filename']): Promise<Tujuan> {
        const tujuan = await this.tujuanRepository.findOne({ where: { id } });

        if (!tujuan) throw new UnprocessableEntityException('Tujuan not found');

        return await this.tujuanRepository.update({ ...data, gambar: gambar ?? tujuan.gambar }, { where: { id } }).then(async () => await this.tujuanRepository.findOne({
            where: { id }
        }));

    }

    async delete(id: number): Promise<Tujuan> {
        const tujuan = await this.tujuanRepository.findOne({ where: { id } });

        if (!tujuan) throw new UnprocessableEntityException('Tujuan not found');

        return await this.tujuanRepository.destroy({ where: { id } }).then(() => tujuan);
    }
}
