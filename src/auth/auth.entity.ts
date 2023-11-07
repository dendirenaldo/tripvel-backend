
import { BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { RoleType } from 'src/general/role.type';
import { ResetPassword } from './reset-password.entity';
import { JenisKelaminType } from 'src/general/jenis-kelamin.type';
import { Berita } from 'src/berita/berita.entity';
import { Travel } from 'src/travel/travel.entity';
import { Jadwal } from 'src/jadwal/jadwal.entity';
import { Transaksi } from 'src/transaksi/transaksi.entity';

@Table({
    tableName: 'auth'
})
export class Auth extends Model<Auth>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @ForeignKey(() => Travel)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'travel_id'
    })
    travelId?: number;

    @Column({
        type: DataType.BIGINT,
        unique: true,
        allowNull: true,
        field: 'verification_code'
    })
    verificationCode?: number;

    @Column({
        type: new DataType.STRING(191),
        unique: true,
        allowNull: false
    })
    email: string;

    @Column({
        type: new DataType.STRING(191),
        unique: true,
        allowNull: true,
        field: 'google_id'
    })
    googleId?: string;

    @Column({
        type: new DataType.STRING(191),
        allowNull: true
    })
    password?: string;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
        field: 'nama_lengkap'
    })
    namaLengkap: string;

    @Column({
        type: DataType.BIGINT,
        allowNull: true,
        field: 'nomor_ponsel'
    })
    nomorPonsel?: number;

    @Column({
        type: DataType.ENUM(JenisKelaminType.LakiLaki, JenisKelaminType.Perempuan),
        allowNull: true,
        field: 'jenis_kelamin'
    })
    jenisKelamin?: JenisKelaminType;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true
    })
    latitude?: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true
    })
    longitude?: number;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
        defaultValue: 'default.png'
    })
    gambar: string;

    @Column({
        type: DataType.ENUM(RoleType.Admin, RoleType.Travel, RoleType.Supir, RoleType.Pelanggan),
        allowNull: true
    })
    role?: RoleType;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_active'
    })
    isActive?: boolean;

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
        onDelete: 'SET NULL'
    })
    travel: Travel;

    @HasOne(() => ResetPassword)
    resetPassword: ResetPassword

    @HasMany(() => Berita)
    berita?: Berita[];

    @HasMany(() => Jadwal)
    jadwal?: Jadwal[];

    @HasMany(() => Transaksi)
    transaksi?: Transaksi[];
}