import { Tujuan } from "../tujuan.entity";

export interface FindAllTujuanInterface {
    readonly data: Tujuan[],
    readonly totalData: number,
    readonly totalRow: number,
}