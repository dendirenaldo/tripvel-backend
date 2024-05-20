import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';
import { JadwalType } from 'src/general/jadwal.type';
import { KursiTerisi } from 'src/kursi-terisi/kursi-terisi.entity';
import { Mobil } from 'src/mobil/mobil.entity';
import { Transaksi } from 'src/transaksi/transaksi.entity';
import { Travel } from 'src/travel/travel.entity';
import { Tujuan } from 'src/tujuan/tujuan.entity';

@Table({
    tableName: 'jadwal'
})
export class Jadwal extends Model<Jadwal>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @ForeignKey(() => Travel)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'travel_id'
    })
    travelId: number;

    @ForeignKey(() => Mobil)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'mobil_id'
    })
    mobilId: number;

    @ForeignKey(() => Auth)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'supir_id'
    })
    supirId: number;

    @ForeignKey(() => Tujuan)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'asal_id'
    })
    asalId: number;

    @ForeignKey(() => Tujuan)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'tujuan_id'
    })
    tujuanId: number;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    tanggal: Date;

    @Column({
        type: DataType.TIME,
        allowNull: false,
        field: 'jam_berangkat'
    })
    jamBerangkat: string;

    @Column({
        type: DataType.TIME,
        allowNull: false,
        field: 'jam_tiba'
    })
    jamTiba: string;

    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    harga: number;

    @Column({
        type: DataType.ENUM(JadwalType.Ekonomi, JadwalType.Eksekutif),
        allowNull: false,
    })
    tipe: JadwalType;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'created_at'
    })
    createdAt: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'updated_at'
    })
    updatedAt: string;

    @BelongsTo(() => Travel, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    })
    travel: Travel;

    @BelongsTo(() => Mobil, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    })
    mobil: Mobil;

    @BelongsTo(() => Auth, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    })
    supir: Auth;

    @BelongsTo(() => Tujuan, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        foreignKey: 'asalId',
        as: 'asal'
    })
    asal: Tujuan;

    @BelongsTo(() => Tujuan, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        foreignKey: 'tujuanId',
        as: 'tujuan'
    })
    tujuan: Tujuan;

    @HasMany(() => Transaksi)
    transaksi: Transaksi[];

    @HasMany(() => KursiTerisi)
    kursiTerisi?: KursiTerisi[];
}
