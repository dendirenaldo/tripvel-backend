import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Transaksi } from './transaksi.entity';
import { ChangeStatusPenjemputanDto, InsertTransaksiDto, QueryTransaksiDto } from './dto';
import { Op, Order, QueryTypes } from 'sequelize';
import { FindAllTransaksiInterface } from './interface';
import { TransaksiList } from './transaksi-list.entity';
import { Tujuan } from 'src/tujuan/tujuan.entity';
import { StatusPembayaranType } from 'src/general/status-pembayaran.type';
import { Jadwal } from 'src/jadwal/jadwal.entity';
import { BankAccount } from 'src/bank-account/bank-account.entity';
import { Travel } from 'src/travel/travel.entity';
import { Mobil } from 'src/mobil/mobil.entity';
import { Promo } from 'src/promo/promo.entity';
import { Konfigurasi } from 'src/konfigurasi/konfigurasi.entity';
import { Auth } from 'src/auth/auth.entity';

@Injectable()
export class TransaksiService {
    constructor(
        @Inject('TRANSAKSI_REPOSITORY')
        private transaksiRepository: typeof Transaksi,

        @Inject('TRANSAKSI_LIST_REPOSITORY')
        private transaksiListRepository: typeof TransaksiList,

        @Inject('PROMO_REPOSITORY')
        private promoRepository: typeof Promo,

        @Inject('KONFIGURASI_REPOSITORY')
        private konfigurasiRepository: typeof Konfigurasi,
    ) { }

    async findAll(query: QueryTransaksiDto, user: any): Promise<FindAllTransaksiInterface> {
        const order: Order = [];
        const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        let where = [];

        if (query.order) {
            order.push([Array.isArray(query.order.index) ? (camelToSnakeCase(query.order.index.join('.'))).toLowerCase() : (camelToSnakeCase(query.order.index)).toLowerCase(), query.order.order]);
        } else {
            order.push(['createdAt', 'DESC']);
        }

        if (query.search) {
            where = [
                ...where,
                `asal.nama_lengkap LIKE '%${query.search}%
                OR asal.nama_singkatan LIKE '%${query.search}%
                OR tujuan.nama_lengkap LIKE '%${query.search}%
                OR tujuan.nama_singkatan LIKE '%${query.search}%
                OR travel.nama LIKE '%${query.search}%
                OR jadwal.tanggal LIKE '%${query.search}%
                OR jadwal.jam_berangkat LIKE '%${query.search}%
                OR jadwal.jam_tiba LIKE '%${query.search}%`
            ];
        }
        if (user.role === 'Pelanggan') {
            where = [
                ...where,
                `transaksi.user_id = ${user.id}`
            ]
        } else if (user.role === 'Travel' || user.role === 'Supir') {
            where = [
                ...where,
                `jadwal.travel_id = '${user.travelId}'`
            ];

            if (user.role === 'Supir') where.push(`jadwal.supir_id ='${user.id}'`);
        } else {
            if (query.userId) {
                where = [
                    ...where,
                    `transaksi.user_id = ${query.userId}`
                ]
            }
        }

        if (query.isPast !== null) {
            where = [
                ...where,
                query.isPast === true ? `DATE(jadwal.tanggal) < DATE(NOW())` : `DATE(jadwal.tanggal) >= DATE(NOW())`
            ]
        }

        const transaksi: Transaksi[] = await this.transaksiRepository.sequelize.query(`
        SELECT 
            transaksi.id,
            transaksi.user_id AS userId,
            transaksi.jadwal_id AS jadwalId,
            transaksi.promo_id AS promoId,
            transaksi.bank_account_id AS bankAccountId,
            transaksi.metode_pembayaran AS metodePembayaran,
            transaksi.status_pembayaran AS statusPembayaran,
            transaksi.harga,
            transaksi.latitude,
            transaksi.longitude,
            transaksi.alamat_tambahan AS alamatTambahan,
            transaksi.status_penjemputan AS statusPenjemputan,
            jadwal.created_at AS createdAt,
            jadwal.updated_at AS updatedAt,
            jadwal.id AS \`jadwal.id\`,
            jadwal.travel_id AS \`jadwal.travelId\`,
            jadwal.supir_id AS \`jadwal.supirId\`,
            jadwal.asal_id AS \`jadwal.asalId\`,
            jadwal.tujuan_id AS \`jadwal.tujuanId\`,
            jadwal.tanggal AS \`jadwal.tanggal\`,
            jadwal.jam_berangkat AS \`jadwal.jamBerangkat\`,
            jadwal.jam_tiba AS \`jadwal.jamTiba\`,
            jadwal.harga AS \`jadwal.harga\`,
            jadwal.created_at AS \`jadwal.createdAt\`,
            jadwal.updated_at AS \`jadwal.updatedAt\`,
            travel.nama AS \`jadwal.travel.nama\`,
            asal.nama_singkatan AS \`jadwal.asal.namaSingkatan\`,
            asal.nama_lengkap AS \`jadwal.asal.namaLengkap\`,
            tujuan.nama_singkatan AS \`jadwal.tujuan.namaSingkatan\`,
            tujuan.nama_lengkap AS \`jadwal.tujuan.namaLengkap\`,
            supir.nama_lengkap AS \`jadwal.supir.namaLengkap\`,
            supir.latitude AS \`jadwal.supir.latitude\`,
            supir.longitude AS \`jadwal.supir.longitude\`,
            mobil.merek AS \`jadwal.mobil.merek\`,
            mobil.model AS \`jadwal.mobil.model\`,
            mobil.plat_nomor AS \`jadwal.mobil.platNomor\`,
            mobil.jumlah_penumpang AS \`jadwal.mobil.jumlahPenumpang\`,
            COUNT(transaksi_list.id) AS jumlahTerpesan
        FROM transaksi
        LEFT JOIN transaksi_list
            ON transaksi.id = transaksi_list.transaksi_id
        JOIN jadwal 
            ON transaksi.jadwal_id = jadwal.id
        LEFT JOIN auth AS supir
            ON jadwal.supir_id = supir.id
        JOIN travel
            ON jadwal.travel_id = travel.id
        JOIN mobil
            ON jadwal.mobil_id = mobil.id
        JOIN tujuan AS asal
            ON jadwal.asal_id = asal.id
        JOIN tujuan AS tujuan
            ON jadwal.tujuan_id = tujuan.id
        ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''}
        GROUP BY transaksi.id
        ${order && order.length > 0 ? 'ORDER BY ' + order.map((val) => val[0] + ' ' + val[1]) : ''}
        ${query.limit ? `LIMIT ${query.limit}` : ''}
        ${query.offset ? `OFFSET ${query.offset}` : ''}
        `, { type: QueryTypes.SELECT })
        const convertedData = (data) => {
            return data.map(obj => {
                const newObj = {};
                for (let key in obj) {
                    const parts = key.split('.');
                    let currentObj = newObj;
                    for (let i = 0; i < parts.length - 1; i++) {
                        const part = parts[i];
                        currentObj[part] = currentObj[part] || {};
                        currentObj = currentObj[part];
                    }
                    currentObj[parts[parts.length - 1]] = obj[key];
                }
                return newObj;
            })
        };
        const jumlahData: any = await this.transaksiRepository.sequelize.query(`
        SELECT 
            COUNT(jadwal.id) AS jumlah,
            mobil.jumlah_penumpang AS \`mobil.jumlahPenumpang\`,
            COUNT(transaksi_list.id) AS jumlahTerpesan
        FROM transaksi
        LEFT JOIN transaksi_list
            ON transaksi.id = transaksi_list.transaksi_id
        JOIN jadwal 
            ON transaksi.jadwal_id = jadwal.id
        JOIN travel
            ON jadwal.travel_id = travel.id
        JOIN mobil
            ON jadwal.mobil_id = mobil.id
        JOIN tujuan AS asal
            ON jadwal.asal_id = asal.id
        JOIN tujuan AS tujuan
            ON jadwal.tujuan_id = tujuan.id
        ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''}
        GROUP BY jadwal.id
                `, { type: QueryTypes.SELECT })

        return {
            data: convertedData(transaksi),
            totalData: jumlahData,
            totalRow: transaksi.length
        }
    }

    async findOne(id: number): Promise<Transaksi> {
        const transaksi = await this.transaksiRepository.findOne({
            where: { id },
            include: [{
                model: TransaksiList,
                as: 'transaksiList',
            }, {
                model: Jadwal,
                as: 'jadwal',
                include: [{
                    model: Travel,
                    as: 'travel',
                    attributes: ['id', 'nama']
                }, {
                    model: Mobil,
                    as: 'mobil',
                    attributes: ['id', 'merek', 'model', 'platNomor', 'warna', 'jumlahPenumpang']
                }, {
                    model: Tujuan,
                    as: 'asal',
                    attributes: ['id', 'namaSingkatan', 'namaLengkap', 'latitude', 'longitude']
                }, {
                    model: Tujuan,
                    as: 'tujuan',
                    attributes: ['id', 'namaSingkatan', 'namaLengkap', 'latitude', 'longitude']
                }]
            }, {
                model: BankAccount,
                as: 'bankAccount',
                attributes: ['id', 'namaBank', 'nomorRekening', 'namaPemilik']
            }, {
                model: Auth,
                as: 'user',
                attributes: ['id', 'namaLengkap', 'nomorPonsel', 'gambar']
            }]
        });

        if (!transaksi) throw new UnprocessableEntityException('Transaksi not found');

        return transaksi;
    }

    async create(data: InsertTransaksiDto, userId: number): Promise<Transaksi> {
        const { transaksiList, ...filteredData } = data;
        let diskon: number = 0;
        const biayaLayanan: number = +(await (await this.konfigurasiRepository.findByPk('biaya_layanan')).nilai);

        if (filteredData.promoId) {
            const promo: Promo = await this.promoRepository.findByPk(filteredData.promoId);
            if (!promo) {
                throw new UnprocessableEntityException('Promo telah habis!');
            } else if (promo !== null && promo.minimalHarga > filteredData.harga) {

            }

            diskon = promo.diskon;
        }

        return await this.transaksiRepository.create({
            ...filteredData,
            userId: userId,
            statusPembayaran: filteredData.metodePembayaran === 'Tunai' ? StatusPembayaranType.Proses : StatusPembayaranType.Belum,
            diskon,
            biayaLayanan
        }, { raw: true }).then((res) => {
            return Promise.all(
                transaksiList.map(async (val) => {
                    await this.transaksiListRepository.create({
                        transaksiId: res.id,
                        namaLengkap: val.namaLengkap,
                        nomorKursi: val.nomorKursi,
                    })
                })
            ).then(async () => await this.transaksiRepository.findByPk(res.id, {
                include: [{
                    model: TransaksiList,
                    as: 'transaksiList'
                }]
            }));
        });
    }

    async uploadBuktiPembayaran(id: number, gambar: Express.Multer.File['filename'], userId: number) {
        const transaksi = await this.findOne(id);

        if (transaksi.userId === userId) {
            return await this.transaksiRepository.update({ buktiPembayaran: gambar, statusPembayaran: StatusPembayaranType.Proses }, { where: { id } }).then(async () => await this.findOne(id));
        } else {
            throw new UnprocessableEntityException('You cannot upload the bukti pembayaran!')
        }
    }

    async batal(id: number, user: any) {
        const transaksi = await this.findOne(id);

        if (user.role === 'Admin' || (user.role === 'Travel' && transaksi.jadwal.travelId === user.travelId) || (transaksi.userId === user.id && user.role === 'Pelanggan')) {
            return await this.transaksiRepository.update({ statusPembayaran: StatusPembayaranType.Batal }, { where: { id: id } }).then(async (res) => await this.findOne(id));
        } else {
            throw new UnprocessableEntityException('You cannot change the status!')
        }
    }

    // async update(id: number, data: InsertTransaksiDto): Promise<Transaksi> {
    //     const { transaksiList, ...filteredData } = data;
    //     const transaksi = await this.transaksiRepository.findOne({ where: { id } });

    //     if (!transaksi) throw new UnprocessableEntityException('Transaksi not found');

    //     await this.transaksiRepository.update({ ...filteredData }, { where: { id } });
    //     await this.transaksiListRepository.destroy({
    //         where: {
    //             transaksiId: id,
    //             transaksiList: {
    //                 [Op.not]: transaksiList.map((val) => val)
    //             }
    //         }
    //     })
    //     const transaksiListCurrent: TransaksiList[] = await this.transaksiListRepository.findAll({ where: { transaksiId: id } });
    //     const transaksiListCurrentArray = transaksiListCurrent.map((val) => val.tujuanId);
    //     const transaksiListArray = Tujuan.map((val) => val);
    //     const notExists = transaksiListArray.filter(num => !transaksiListCurrentArray.includes(num));
    //     return Promise.all(
    //         notExists.map(async (val) => {
    //             await this.transaksiListRepository.create({ transaksiId: id, tujuanId: val })
    //         })
    //     ).then(async () => await this.transaksiRepository.findOne({
    //         where: { id }, raw: true, include: [{
    //             model: TransaksiList,
    //             as: 'transaksiList',
    //             include: [{
    //                 model: Tujuan,
    //                 as: 'tujuan'
    //             }]
    //         }]
    //     }))

    // }

    async changeStatusPenjemputan(id: number, data: ChangeStatusPenjemputanDto) {
        return await this.transaksiRepository.update(data, { where: { id } }).then(async (res) => await this.findOne(id));
    }

    async deleteTransaksiList(transaksiListId: number): Promise<TransaksiList> {
        const transaksiList = await this.transaksiListRepository.findOne({ where: { id: transaksiListId } });

        if (!transaksiList) throw new UnprocessableEntityException('Transaksi list not found');

        await this.transaksiListRepository.destroy({ where: { id: transaksiListId } });
        return transaksiList;
    }

    async delete(id: number): Promise<Transaksi> {
        const transaksi = await this.transaksiRepository.findOne({ where: { id } });

        if (!transaksi) throw new UnprocessableEntityException('Transaksi not found');

        return await this.transaksiRepository.destroy({ where: { id } }).then(() => transaksi);
    }
}
