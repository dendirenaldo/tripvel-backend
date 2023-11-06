import { Transaksi } from "../transaksi.entity";

export interface FindAllTransaksiInterface {
    readonly data: Transaksi[],
    readonly totalData: number,
    readonly totalRow: number,
}