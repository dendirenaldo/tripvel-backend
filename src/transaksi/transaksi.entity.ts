
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { TransaksiList } from './transaksi-list.entity';
import { Auth } from 'src/auth/auth.entity';
import { Jadwal } from 'src/jadwal/jadwal.entity';
import { Promo } from 'src/promo/promo.entity';
import { BankAccount } from 'src/bank-account/bank-account.entity';
import { MetodePembayaranType } from 'src/general/metode-pembayaran.type';
import { StatusPembayaranType } from 'src/general/status-pembayaran.type';
import { StatusPenjemputanType } from 'src/general/status-penjemputan.type';

@Table({
    tableName: 'transaksi'
})
export class Transaksi extends Model<Transaksi>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @ForeignKey(() => Auth)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'user_id'
    })
    userId: number;

    @ForeignKey(() => Jadwal)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'jadwal_id'
    })
    jadwalId: number;

    @ForeignKey(() => Promo)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'promo_id'
    })
    promoId?: number;

    @ForeignKey(() => BankAccount)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'bank_account_id'
    })
    bankAccountId?: number;

    @Column({
        type: DataType.ENUM(MetodePembayaranType.Tunai, MetodePembayaranType.Transfer),
        allowNull: false,
        field: 'metode_pembayaran'
    })
    metodePembayaran: MetodePembayaranType;

    @Column({
        type: DataType.ENUM(StatusPembayaranType.Belum, StatusPembayaranType.Proses, StatusPembayaranType.Lunas, StatusPembayaranType.Batal),
        allowNull: false,
        field: 'status_pembayaran'
    })
    statusPembayaran: StatusPembayaranType;

    @Column({
        type: new DataType.STRING(191),
        allowNull: true,
        field: 'bukti_pembayaran'
    })
    buktiPembayaran?: string;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
    })
    harga: number;

    @Column({
        type: DataType.BIGINT,
        allowNull: true,
    })
    diskon?: number;

    @Column({
        type: DataType.BIGINT,
        allowNull: true,
        field: 'biaya_layanan'
    })
    biayaLayanan?: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
    })
    latitude?: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
    })
    longitude?: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        field: 'alamat'
    })
    alamat: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        field: 'alamat_tambahan'
    })
    alamatTambahan: string;

    @Column({
        type: DataType.ENUM(StatusPenjemputanType.Belum, StatusPenjemputanType.Proses, StatusPenjemputanType.Sudah, StatusPenjemputanType.Selesai),
        allowNull: true,
        field: 'status_penjemputan'
    })
    statusPenjemputan?: StatusPenjemputanType;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'created_at'
    })
    createdAt: string

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'updated_at'
    })
    updatedAt: string

    @HasMany(() => TransaksiList)
    transaksiList: TransaksiList[];

    @BelongsTo(() => Auth, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    user: Auth;

    @BelongsTo(() => Jadwal, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    jadwal: Jadwal;

    @BelongsTo(() => Promo, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    promo?: Promo;

    @BelongsTo(() => BankAccount, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    bankAccount?: BankAccount;
}
