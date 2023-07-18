import { Travel } from "../travel.entity";

export interface FindAllTravelInterface {
    readonly data: Travel[],
    readonly totalData: number,
    readonly totalRow: number,
}