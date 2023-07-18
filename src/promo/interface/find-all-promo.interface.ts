import { Promo } from "../promo.entity";

export interface FindAllPromoInterface {
    readonly data: Promo[],
    readonly totalData: number,
    readonly totalRow: number,
}