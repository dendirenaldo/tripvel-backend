import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ChangeLocationDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
    latitude: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
    longitude: number;
}