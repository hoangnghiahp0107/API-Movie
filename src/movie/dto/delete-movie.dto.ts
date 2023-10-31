import { ApiProperty } from "@nestjs/swagger";
export class DeletePhimDto {
    @ApiProperty({ type: 'integer', format: 'int32' })
    maPhim: number;
}
