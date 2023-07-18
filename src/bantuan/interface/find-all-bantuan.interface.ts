import { Bantuan } from "../bantuan.entity";

export interface FindAllBantuanInterface {
    readonly data: Bantuan[],
    readonly totalData: number,
    readonly totalRow: number,
}