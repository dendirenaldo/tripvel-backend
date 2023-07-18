import { Mobil } from "../mobil.entity";

export interface FindAllMobilInterface {
    readonly data: Mobil[],
    readonly totalData: number,
    readonly totalRow: number,
}