import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { StatusPenjemputanType } from "src/general/status-penjemputan.type";

export class ChangeStatusPenjemputanDto {
    @ApiProperty()
    @IsEnum(StatusPenjemputanType)
    @IsNotEmpty()
    statusPenjemputan: StatusPenjemputanType;
}