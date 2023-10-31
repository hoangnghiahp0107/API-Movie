import { Controller, Get, UseGuards, Query} from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger/dist';
import { CumRap, HeThongRap, Phim } from '@prisma/client';
import { HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))

@ApiTags("QuanLyRap")
@Controller('/api/QuanLyRap')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Get("/LayThongTinHeThongRap")
  @ApiQuery({ name: 'maHeThongRap', required: false })
  async getRapPhim(@Query("maHeThongRap") maHeThongRap: string): Promise<{ statusCode: number, message: string, content: string |HeThongRap[]}> {
    if (maHeThongRap && maHeThongRap.trim() !== "") {
      const maHeThongRapNumber = parseInt(maHeThongRap, 10); 
      const content = await this.cinemaService.getRapPhimByID(maHeThongRapNumber);
      return { statusCode: 200, message: "Xử lý thành công", content: content};
    } else {
      const content = await this.cinemaService.getRapPhim();
      return { statusCode: 200, message: "Xử lý thành công", content: content};
    }
  }

  @Get("/LayThongTinCumRapTheoHeThong")
  @ApiQuery({ name: 'maHeThongRap', required: false })
  @HttpCode(400)
  async getHeThongRapPhim(@Query("maHeThongRap") maHeThongRap: string): Promise<{ statusCode: number, message: string, content: string | CumRap[]}> {
    if (maHeThongRap && maHeThongRap.trim() !== "") {
      const maHeThongRapNumber = maHeThongRap ? parseInt(maHeThongRap, 10) : null;
      const content = await this.cinemaService.getHeThongRapPhim(maHeThongRapNumber);
      return { statusCode: 200, message: "Xử lý thành công", content: content};
    } else {
      return { statusCode: 400, message: "Không tìm thấy tài nguyên!", content: "Mã hệ thống rạp không tồn tại!"};
    }
  }

  @Get("/LayThongTinLichChieuHeThongRap")
  @ApiQuery({ name: 'maHeThongRap', required: false })
  async getLichChieuHeThong(@Query("maHeThongRap") maHeThongRap: string): Promise<{ statusCode: number, message: string, content: string | HeThongRap[] }> {
    if (maHeThongRap && maHeThongRap.trim() !== "") {
      const maHeThongRapNumber = maHeThongRap ? parseInt(maHeThongRap, 10) : null;
      const content = await this.cinemaService.getLichChieuHeThongByID(maHeThongRapNumber);
      return { statusCode: 200, message: "Xử lý thành công", content: content};
    } else {
      const content = await this.cinemaService.getLichChieuHeThong();
      return { statusCode: 200, message: "Xử lý thành công", content: content};
    }
  }

  @Get("/LayThongTinLichChieuPhim")
  @ApiQuery({ name: 'MaPhim', required: false })
  @HttpCode(400)
  async getLichChieuPhim(@Query("MaPhim") maPhim: string): Promise<{ statusCode: number, message: string, content: string | Phim[] }> {
    if (maPhim && maPhim.trim() !== "") {
      const maPhimNumber = maPhim ? parseInt(maPhim, 10) : null;
      const content = await this.cinemaService.getLichChieuPhim(maPhimNumber);

      if (content) {
        return { statusCode: 200, message: "Xử lý thành công", content: content };
      } else {
        return { statusCode: 400, message: "Không tìm thấy tài nguyên!", content: "Mã phim không tồn tại!" };
      }
    } else {
      return { statusCode: 400, message: "Không tìm thấy tài nguyên!", content: "Mã phim không tồn tại!" };
    }
  }
}
