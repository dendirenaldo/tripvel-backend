import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Jadwal } from 'src/jadwal/jadwal.entity';

@Table({
    tableName: 'kursi_terisi'
})
export class KursiTerisi extends Model<KursiTerisi>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @ForeignKey(() => Jadwal)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'jadwal_id'
    })
    jadwalId: number;

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
    createdAt: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'updated_at'
    })
    updatedAt: string;

    @BelongsTo(() => Jadwal, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    })
    jadwal: Jadwal;
}
