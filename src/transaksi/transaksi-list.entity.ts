
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Transaksi } from './transaksi.entity';

@Table({
    tableName: 'transaksi_list'
})
export class TransaksiList extends Model<TransaksiList>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @ForeignKey(() => Transaksi)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'transaksi_id'
    })
    transaksiId: number;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
        field: 'nama_lengkap'
    })
    namaLengkap: string;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
        field: 'nomor_kursi'
    })
    nomorKursi: string;

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

    @BelongsTo(() => Transaksi, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    transaksi: Transaksi;
}
