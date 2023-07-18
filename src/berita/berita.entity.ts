import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';
import { Kategori } from 'src/kategori/kategori.entity';

@Table({
    tableName: 'berita'
})
export class Berita extends Model<Berita>  {
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
        field: 'auth_id'
    })
    authId: number;

    @ForeignKey(() => Kategori)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'kategori_id'
    })
    kategoriId: number;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
    })
    judul: string;

    @Column({
        type: DataType.TEXT('medium'),
        allowNull: false,
    })
    deskripsi: string;

    @Column({
        type: DataType.TEXT('long'),
        allowNull: false,
    })
    isi: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'waktu_membaca'
    })
    waktuMembaca: number;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
    })
    gambar: string;

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

    @BelongsTo(() => Auth, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    })
    auth: Auth;

    @BelongsTo(() => Kategori, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    })
    kategori: Kategori;
}
