import { ApiProperty } from "@nestjs/swagger";

export class LichChieuInsert {
    @ApiProperty({ type: 'integer', format: 'int32' })
    maPhim: number;

    @ApiProperty()
    ngayChieuGioChieu: string;

    @ApiProperty()
    maRap: string;

    @ApiProperty({ type: 'number', format: 'double' })
    giaVe: number;
}
