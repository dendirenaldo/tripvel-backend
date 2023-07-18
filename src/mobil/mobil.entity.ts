import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Travel } from 'src/travel/travel.entity';

@Table({
    tableName: 'mobil'
})
export class Mobil extends Model<Mobil>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true
    })
    id: number;

    @ForeignKey(() => Travel)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'travel_id'
    })
    travelId: number;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
    })
    merek: string;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
    })
    model: string;

    @Column({
        type: new DataType.STRING(15),
        allowNull: false,
        field: 'plat_nomor'
    })
    platNomor: string;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false
    })
    warna: string;

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
}
