import { KursiTerisi } from "../kursi-terisi.entity";

export interface FindAllKursiTerisiInterface {
    readonly data: KursiTerisi[],
    readonly totalData: number,
    readonly totalRow: number,
}