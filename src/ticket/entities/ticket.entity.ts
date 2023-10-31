import { ApiProperty } from "@nestjs/swagger";

export class VeVM {
  @ApiProperty({ type: 'integer', format: 'int32' })
  ma_ghe: number;

  @ApiProperty({ type: 'number', format: 'double' })
  gia_ve: number;
}

export class DanhSachVeDat {
  @ApiProperty({ type: 'integer', format: 'int32' })
  tai_khoan: number;
  @ApiProperty({ type: 'integer', format: 'int32' })
  ma_lich_chieu: number;
  @ApiProperty({ type: 'integer', format: 'int32' })
  ma_ghe: number;
}

export class LichChieuInsert {
    @ApiProperty({ type: 'integer', format: 'int32' })
    ma_rap: number;

    @ApiProperty({ type: 'integer', format: 'int32' })
    ma_phim: number;

    @ApiProperty()
    ngay_gio_chieu: string;

    @ApiProperty({ type: 'number', format: 'double' })
    gia_ve: number;
}

