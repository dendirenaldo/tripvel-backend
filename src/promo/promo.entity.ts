
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { PromoList } from './promo-list.entity';
import { Transaksi } from 'src/transaksi/transaksi.entity';

@Table({
    tableName: 'promo'
})
export class Promo extends Model<Promo>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
    })
    judul: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    deskripsi: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
        field: 'tanggal_berlaku'
    })
    tanggalBerlaku: Date;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        field: 'minimal_harga'
    })
    minimalHarga: number;

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

    @HasMany(() => PromoList)
    promoList?: PromoList;

    @HasMany(() => Transaksi)
    transaksi?: Transaksi;
}
