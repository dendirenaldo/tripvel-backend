import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'tujuan'
})
export class Tujuan extends Model<Tujuan>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true
    })
    id: number;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
        field: 'nama_lengkap'
    })
    namaLengkap: string;

    @Column({
        type: new DataType.STRING(10),
        allowNull: false,
        field: 'nama_singkatan'
    })
    namaSingkatan: string;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    latitude: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    longitude: number;

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
}
