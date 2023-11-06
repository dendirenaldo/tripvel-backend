import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { RoleType } from "src/general/role.type";

class OrderDto {
    @ApiPropertyOptional({ enum: ['namaLengkap', 'email', 'role', 'nomorPonsel', 'jenisKelamin', 'latitude', 'longitude'] })
    @IsOptional()
    @IsEnum(['namaLengkap', 'email', 'role', 'nomorPonsel', 'jenisKelamin', 'latitude', 'longitude'])
    index: string;

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    order: string;
}

export class QueryAccountDto {
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

    @ApiPropertyOptional({ enum: RoleType })
    @IsOptional()
    @IsEnum(RoleType)
    filterRole?: RoleType;
}