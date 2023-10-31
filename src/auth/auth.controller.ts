import { Controller, Get, Post, Body, Query, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger/dist';
import { ApiQuery } from '@nestjs/swagger';
import { NguoiDung } from '@prisma/client';
import { NguoiDungVM, NguoiDung_VM, ThongTinDangNhapVM } from './entities/auth.entity';
import { LoginDto } from './dto/login-auth.dto';
import { SignUpDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';


@ApiTags("QuanLyNguoiDung")
@Controller('/api/QuanLyNguoiDung')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @HttpCode(200)
  @ApiBody({
    type: ThongTinDangNhapVM,
  })
  @Post('/DangNhap')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @HttpCode(200)
  @ApiBody({
    type: NguoiDung_VM,
  })
  @Post('/DangKy')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("/LayDanhSachNguoiDung")
  @ApiQuery({ name: 'tuKhoa', required: false })
  async getUser(@Query("tuKhoa") tuKhoa: string): Promise<NguoiDung[]> {
    if (tuKhoa && tuKhoa.trim() !== "") {
      return this.authService.getSearchUser(tuKhoa);
    } else {
      return this.authService.getUser();
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("/LayDanhSachNguoiDungPhanTrang")
  @ApiQuery({ name: 'tuKhoa', required: false })
  @ApiQuery({ name: 'soTrang', type: 'integer', required: false })
  @ApiQuery({ name: 'soPhanTuTrenTrang', type: 'integer', required: false })
  async getUserPage(
    @Query("tuKhoa") tuKhoa: string,
    @Query("soTrang") soTrang: number = 1,
    @Query("soPhanTuTrenTrang") soPhanTuTrenTrang: number = 10
  ): Promise<NguoiDung[]> {
    let users: NguoiDung[];
    if (tuKhoa && tuKhoa.trim() !== "") {
      users = await this.authService.getSearchUser(tuKhoa);
    } else {
      users = await this.authService.getUser();
    }
    const start = (soTrang - 1) * soPhanTuTrenTrang;
    const end = start + soPhanTuTrenTrang;
    const paginatedUsers = users.slice(start, end);
    return paginatedUsers;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("/TimKiemNguoiDung")
  @ApiQuery({ name: 'tuKhoa', required: false })
  async getSearchUser(@Query("tuKhoa") tuKhoa: string): Promise<NguoiDung[]> {
    if (tuKhoa && tuKhoa.trim() !== "") {
      return this.authService.getSearchUser(tuKhoa);
    } else {
      return this.authService.getUser();
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("/TimKiemNguoiDungPhanTrang")
  @ApiQuery({ name: 'tuKhoa', required: false })
  @ApiQuery({ name: 'soTrang', type: 'integer', required: false })
  @ApiQuery({ name: 'soPhanTuTrenTrang', type: 'integer', required: false })
  async getSearchUserPage(
    @Query("tuKhoa") tuKhoa: string,
    @Query("soTrang") soTrang: number = 1,
    @Query("soPhanTuTrenTrang") soPhanTuTrenTrang: number = 10
  ): Promise<NguoiDung[]> {
    let users: NguoiDung[];
    if (tuKhoa && tuKhoa.trim() !== "") {
      users = await this.authService.getSearchUser(tuKhoa);
    } else {
      users = await this.authService.getUser();
    }
    const start = (soTrang - 1) * soPhanTuTrenTrang;
    const end = start + soPhanTuTrenTrang;
    const paginatedUsers = users.slice(start, end);
    return paginatedUsers;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post("/ThongTinTaiKhoan")
  getInfoUser(){
    return this.authService.getUser();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post("/LayThongTinNguoiDung")
  getInfoUserTK(){
    return this.authService.getUser();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(200)
  @ApiBody({
    type: NguoiDungVM,
  })
  @Post('/ThemNguoiDung')
  signUpND(@Body() body: SignUpDto) {
    return this.authService.signUpND(body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(200)
  @ApiBody({
    type: NguoiDungVM,
  })
  @Put("/CapNhatThongTinNguoiDung")
  updateUser(@Body() body: SignUpDto){
    return this.authService.updateUser(body);
  }   

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(200)
  @Delete("/XoaNguoiDung")
  @ApiQuery({ name: 'tai_khoan', required: false })
  async deleteUser(@Query("tai_khoan") tai_khoanStr: string): Promise<{ statusCode: number, message: string, content: string | NguoiDung[] }> {
    const tai_khoan = parseInt(tai_khoanStr, 10);
    if (isNaN(tai_khoan)) {
      return {
        statusCode: 400,
        message: "Dữ liệu không hợp lệ!",
        content: "Thiếu thông tin tài khoản."
      };
    }
    const deletedUsers = await this.authService.deleteUser(tai_khoan);
    return {
      statusCode: 200,
      message: "Xóa người dùng thành công",
      content: deletedUsers
    };
  }
}
