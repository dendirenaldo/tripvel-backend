
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Promo } from './promo.entity';
import { Tujuan } from 'src/tujuan/tujuan.entity';

@Table({
    tableName: 'promo_list'
})
export class PromoList extends Model<PromoList>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @ForeignKey(() => Promo)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'promo_id'
    })
    promoId: number;

    @ForeignKey(() => Tujuan)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'tujuan_id'
    })
    tujuanId: number;

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

    @BelongsTo(() => Promo, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    promo: Promo;

    @BelongsTo(() => Tujuan, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    tujuan: Tujuan;
}
