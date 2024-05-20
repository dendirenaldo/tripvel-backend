import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Promo } from './promo.entity';
import { InsertPromoDto, QueryPromoDto } from './dto';
import { Op } from 'sequelize';
import { FindAllPromoInterface } from './interface';
import { PromoList } from './promo-list.entity';
import { Tujuan } from 'src/tujuan/tujuan.entity';

@Injectable()
export class PromoService {
    constructor(
        @Inject('PROMO_REPOSITORY')
        private promoRepository: typeof Promo,

        @Inject('PROMO_LIST_REPOSITORY')
        private promoListRepository: typeof PromoList
    ) { }

    async findAll(query: QueryPromoDto, userId: number): Promise<FindAllPromoInterface> {
        const promo = await this.promoRepository.findAll({
            ...(query?.offset && { offset: query?.offset }),
            ...(query?.limit && { limit: query?.limit }),
            include: [{
                model: PromoList,
                as: 'promoList',
                include: [{
                    model: Tujuan,
                    as: 'tujuan'
                }]
            }],
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        judul: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        deskripsi: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        minimalHarga: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        tanggalBerlaku: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        const jumlahData = await this.promoRepository.count({
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        judul: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        deskripsi: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        minimalHarga: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        tanggalBerlaku: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        return {
            data: promo,
            totalData: jumlahData,
            totalRow: promo.length
        }
    }

    async findOne(id: number): Promise<Promo> {
        const promo = await this.promoRepository.findOne({
            where: { id },
            include: [{
                model: PromoList,
                as: 'promoList',
                include: [{
                    model: Tujuan,
                    as: 'tujuan'
                }]
            }]
        });

        if (!promo) throw new UnprocessableEntityException('Promo not found');

        return promo;
    }

    async create(data: InsertPromoDto): Promise<Promo> {
        const { tujuanId, ...filteredData } = data;
        return await this.promoRepository.create({ ...filteredData }, { raw: true }).then(async (res) => {
            if (tujuanId !== undefined && tujuanId.length > 0) {
                return Promise.all(
                    tujuanId.map(async (val) => {
                        await this.promoListRepository.create({
                            promoId: res.id,
                            tujuanId: val
                        })
                    })
                ).then(async () => await this.promoRepository.findByPk(res.id, {
                    include: [{
                        model: PromoList,
                        as: 'promoList',
                        include: [{
                            model: Tujuan,
                            as: 'tujuan'
                        }]
                    }]
                }));
            } else {
                return await this.promoRepository.findByPk(res.id, {
                    include: [{
                        model: PromoList,
                        as: 'promoList',
                        include: [{
                            model: Tujuan,
                            as: 'tujuan'
                        }]
                    }]
                });
            }
        });
    }

    async update(id: number, data: InsertPromoDto): Promise<Promo> {
        const { tujuanId, ...filteredData } = data;
        const promo = await this.promoRepository.findOne({ where: { id } });

        if (!promo) throw new UnprocessableEntityException('Promo not found');

        await this.promoRepository.update({ ...filteredData }, { where: { id } });
        await this.promoListRepository.destroy({
            where: {
                promoId: id,
                tujuanId: {
                    [Op.not]: tujuanId.map((val) => val)
                }
            }
        })
        const promoListCurrent: PromoList[] = await this.promoListRepository.findAll({ where: { promoId: id } });
        const promoListCurrentArray = promoListCurrent.map((val) => val.tujuanId);
        const promoListArray = tujuanId.map((val) => val);
        const notExists = promoListArray.filter(num => !promoListCurrentArray.includes(num));
        return Promise.all(
            notExists.map(async (val) => {
                await this.promoListRepository.create({ promoId: id, tujuanId: val })
            })
        ).then(async () => await this.promoRepository.findOne({
            where: { id }, raw: true, include: [{
                model: PromoList,
                as: 'promoList',
                include: [{
                    model: Tujuan,
                    as: 'tujuan'
                }]
            }]
        }))

    }

    async deletePromoList(promoListId: number): Promise<PromoList> {
        const promoList = await this.promoListRepository.findOne({ where: { id: promoListId } });

        if (!promoList) throw new UnprocessableEntityException('Promo list not found');

        await this.promoListRepository.destroy({ where: { id: promoListId } });
        return promoList;
    }

    async delete(id: number): Promise<Promo> {
        const promo = await this.promoRepository.findOne({ where: { id } });

        if (!promo) throw new UnprocessableEntityException('Promo not found');

        return await this.promoRepository.destroy({ where: { id } }).then(() => promo);
    }
}
