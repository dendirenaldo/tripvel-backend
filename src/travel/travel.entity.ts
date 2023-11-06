import { Column, DataType, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';
import { Jadwal } from 'src/jadwal/jadwal.entity';
import { Mobil } from 'src/mobil/mobil.entity';

@Table({
    tableName: 'travel'
})
export class Travel extends Model<Travel>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
        field: 'nama'
    })
    nama: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    deskripsi: string;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false
    })
    lokasi: string;

    @Column({
        type: DataType.BLOB("long"),
        allowNull: false
    })
    gambar: Buffer;

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

    @HasOne(() => Auth)
    auth: Auth;

    @HasMany(() => Mobil)
    mobil: Mobil[];

    @HasMany(() => Jadwal)
    jadwal: Jadwal[];
}
