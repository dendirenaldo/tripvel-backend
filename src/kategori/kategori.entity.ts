import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Berita } from 'src/berita/berita.entity';

@Table({
    tableName: 'kategori'
})
export class Kategori extends Model<Kategori>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false
    })
    nama: string;

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

    @HasMany(() => Berita)
    berita: Berita;
}
