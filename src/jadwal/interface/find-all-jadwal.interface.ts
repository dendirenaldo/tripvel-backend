import { Jadwal } from "../jadwal.entity";

export interface FindAllJadwalInterface {
    readonly data: Jadwal[],
    readonly totalData: number,
    readonly totalRow: number,
}