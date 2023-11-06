import { BadRequestException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InsertJadwalDto, QueryJadwalDto } from './dto';
import { Order, QueryTypes } from 'sequelize';
import { FindAllJadwalInterface } from './interface';
import { Jadwal } from './jadwal.entity';
import { Transaksi } from 'src/transaksi/transaksi.entity';
import { TransaksiList } from 'src/transaksi/transaksi-list.entity';
import { Mobil } from 'src/mobil/mobil.entity';
import { Tujuan } from 'src/tujuan/tujuan.entity';

@Injectable()
export class JadwalService {
    constructor(
        @Inject('JADWAL_REPOSITORY')
        private jadwalRepository: typeof Jadwal,
    ) { }

    async findAll(query: QueryJadwalDto, user: any): Promise<FindAllJadwalInterface> {
        const order: Order = [];
        const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        let where = [];
        let having = [];

        if (query.order) {
            order.push([Array.isArray(query.order.index) ? (camelToSnakeCase(query.order.index.join('.'))).toLowerCase() : (camelToSnakeCase(query.order.index)).toLowerCase(), query.order.order]);
        } else {
            order.push(['createdAt', 'DESC']);
        }

        if (query.search) {
            where = [
                ...where,
                `asal.nama_lengkap LIKE '%${query.search}%'
                OR asal.nama_singkatan LIKE '%${query.search}%'
                OR tujuan.nama_lengkap LIKE '%${query.search}%'
                OR tujuan.nama_singkatan LIKE '%${query.search}%'
                OR travel.nama LIKE '%${query.search}%'
                OR jadwal.tanggal LIKE '%${query.search}%'
                OR jadwal.jam_berangkat LIKE '%${query.search}%'
                OR jadwal.jam_tiba LIKE '%${query.search}%'
                OR jadwal.tipe LIKE '%${query.search}%'`
            ];
        }

        if (query.asalId && query.tujuanId && query.tanggal) {
            where = [
                ...where,
                `jadwal.tanggal = '${query.tanggal}'
                AND jadwal.asal_id = ${query.asalId}
                AND jadwal.tujuan_id = ${query.tujuanId}`
            ];
        }

        if (query.isAvailable) {
            having = [
                ...having,
                `jumlahTerpesan < \`mobil.jumlahPenumpang\``
            ];
            where = [
                ...where,
                `(transaksi.status_pembayaran <> 'Batal' OR transaksi.status_pembayaran IS NULL)`
            ];
        }

        if (query.filterTipe) {
            where = [
                ...where,
                `jadwal.tipe = '${query.filterTipe}'`
            ];
        }

        if (user.role === 'Travel' || user.role === 'Supir') {
            where = [
                ...where,
                `jadwal.travel_id = '${user.travelId}'`
            ];

            if (user.role === 'Supir') where.push(`jadwal.supir_id ='${user.id}'`);
        }

        const jadwal: Jadwal[] = await this.jadwalRepository.sequelize.query(`
        SELECT 
            jadwal.id,
            jadwal.travel_id AS travelId,
            jadwal.supir_id AS supirId,
            jadwal.asal_id AS asalId,
            jadwal.tujuan_id AS tujuanId,
            jadwal.tanggal,
            jadwal.jam_berangkat AS jamBerangkat,
            jadwal.jam_tiba AS jamTiba,
            jadwal.harga,
            jadwal.created_at AS createdAt,
            jadwal.updated_at AS updatedAt,
            travel.nama AS \`travel.nama\`,
            asal.nama_singkatan AS \`asal.namaSingkatan\`,
            asal.nama_lengkap AS \`asal.namaLengkap\`,
            asal.latitude AS \`asal.latitude\`,
            asal.longitude AS \`asal.longitude\`,
            tujuan.nama_singkatan AS \`tujuan.namaSingkatan\`,
            tujuan.nama_lengkap AS \`tujuan.namaLengkap\`,
            tujuan.latitude AS \`tujuan.latitude\`,
            tujuan.longitude AS \`tujuan.longitude\`,
            mobil.merek AS \`mobil.merek\`,
            mobil.model AS \`mobil.model\`,
            mobil.plat_nomor AS \`mobil.platNomor\`,
            mobil.jumlah_penumpang AS \`mobil.jumlahPenumpang\`,
            supir.nama_lengkap AS \`supir.namaLengkap\`,
            COUNT(transaksi_list.id) AS jumlahTerpesan
        FROM jadwal
        LEFT JOIN transaksi
            ON jadwal.id = transaksi.jadwal_id
        LEFT JOIN transaksi_list
            ON transaksi.id = transaksi_list.transaksi_id
        JOIN auth AS supir
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
        GROUP BY jadwal.id
        ${having.length > 0 ? 'HAVING ' + having.join(' AND ') : ''}
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
        const jumlahData: any = await this.jadwalRepository.sequelize.query(`
        SELECT 
            COUNT(jadwal.id) AS jumlah,
            COUNT(transaksi_list.id) AS jumlahTerpesan,
            mobil.jumlah_penumpang AS \`mobil.jumlahPenumpang\`
        FROM jadwal
        LEFT JOIN transaksi
            ON jadwal.id = transaksi.jadwal_id
        LEFT JOIN transaksi_list
            ON transaksi.id = transaksi_list.transaksi_id
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
        ${having.length > 0 ? 'HAVING ' + having.join(' AND ') : ''}
                `, { type: QueryTypes.SELECT })
        return {
            data: convertedData(jadwal),
            totalData: jumlahData.length,
            totalRow: jadwal.length
        }
    }

    async findOne(id: number): Promise<Jadwal> {
        const jadwal = await this.jadwalRepository.findOne({
            include: [{
                model: Transaksi,
                as: 'transaksi',
                include: [{
                    model: TransaksiList,
                    as: 'transaksiList'
                }]
            }, {
                model: Mobil,
                as: 'mobil',
            }, {
                model: Tujuan,
                as: 'asal',
                attributes: ['id', 'namaSingkatan', 'namaLengkap', 'latitude', 'longitude']
            }],
            where: { id }
        });

        if (!jadwal) throw new UnprocessableEntityException('Jadwal not found');

        return jadwal;
    }

    async create(data: InsertJadwalDto): Promise<Jadwal> {
        return await this.jadwalRepository.create({ ...data }, { raw: true }).then(async (res) => await this.jadwalRepository.findByPk(res.id));
    }

    async update(id: number, data: InsertJadwalDto): Promise<Jadwal> {
        const jadwal = await this.jadwalRepository.findOne({ where: { id } });

        if (!jadwal) throw new UnprocessableEntityException('Jadwal not found');

        return await this.jadwalRepository.update({ ...data }, { where: { id } }).then(async () => await this.jadwalRepository.findOne({
            where: { id }
        }));

    }

    async delete(id: number): Promise<Jadwal> {
        const jadwal = await this.jadwalRepository.findOne({ where: { id } });

        if (!jadwal) throw new UnprocessableEntityException('Jadwal not found');

        try {
            return await this.jadwalRepository.destroy({ where: { id } }).then(() => jadwal);
        } catch (err) {
            if (err.name === 'SequelizeForeignKeyConstraintError') throw new UnprocessableEntityException('Jadwal telah ada transaksi. Jadwal ini tidak dapat dihapuskan!');
        }
    }
}
