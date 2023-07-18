import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'bantuan'
})
export class Bantuan extends Model<Bantuan>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column({
        type: DataType.TEXT('long'),
        allowNull: false
    })
    pertanyaan: string;

    @Column({
        type: DataType.TEXT('long'),
        allowNull: false
    })
    jawaban: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    prioritas: number;

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
