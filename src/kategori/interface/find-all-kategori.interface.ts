import { Kategori } from "../kategori.entity";

export interface FindAllKategoriInterface {
    readonly data: Kategori[],
    readonly totalData: number,
    readonly totalRow: number,
}