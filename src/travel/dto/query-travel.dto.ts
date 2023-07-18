import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

class OrderDto {
    @ApiPropertyOptional({ enum: ['id', 'nama', 'deskripsi', 'lokasi'] })
    @IsOptional()
    @IsEnum(['id', 'nama', 'deskripsi', 'lokasi'])
    index: string;

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    order: string;
}

export class QueryTravelDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => typeof value == 'string' ? parseInt(value) : value)
    offset?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => typeof value == 'string' ? parseInt(value) : value)
    limit?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => typeof value == 'string' ? JSON.parse(value) : value)
    @Type(() => OrderDto)
    order?: OrderDto;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;
}