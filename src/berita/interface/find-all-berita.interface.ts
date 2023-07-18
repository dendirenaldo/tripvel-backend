import { Berita } from "../berita.entity";

export interface FindAllBeritaInterface {
    readonly data: Berita[],
    readonly totalData: number,
    readonly totalRow: number,
}