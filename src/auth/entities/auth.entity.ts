import { ApiProperty } from "@nestjs/swagger";

export class NguoiDung_VM {
    @ApiProperty()
    email:	string
    @ApiProperty()
    mat_khau: string
    @ApiProperty()
    so_dt: string
    @ApiProperty()
    ho_ten: string
}

export class NguoiDungVM {
    @ApiProperty()
    email:	string
    @ApiProperty()
    mat_khau: string
    @ApiProperty()
    so_dt: string
    @ApiProperty()
    loai_nguoi_dung: string
    @ApiProperty()
    ho_ten: string
}

export class ThongTinDangNhapVM {
    @ApiProperty()
    email: string
    @ApiProperty()
    mat_khau: string
}

