import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Transaksi } from 'src/transaksi/transaksi.entity';

@Table({
    tableName: 'bank_account'
})
export class BankAccount extends Model<BankAccount>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
        field: 'nama_bank'
    })
    namaBank: string;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        field: 'nomor_rekening'
    })
    nomorRekening: number;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
        field: 'nama_pemilik'
    })
    namaPemilik: string;

    @Column({
        type: new DataType.BLOB("long"),
        allowNull: false
    })
    gambar: Buffer;

    @Column({
        type: DataType.TEXT('long'),
        allowNull: false
    })
    instruksi: string;

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

    @HasMany(() => Transaksi)
    transaksi?: Transaksi[];
}
