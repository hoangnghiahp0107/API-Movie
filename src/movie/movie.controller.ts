import { Controller, Get, Post, Delete, Query, UseInterceptors, UploadedFile, UseGuards  } from '@nestjs/common';
import { MovieService } from './movie.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiBody, ApiConsumes, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HttpCode } from '@nestjs/common';
import { LichChieu, Phim } from '@prisma/client';
import { FileUploadDto } from './dto/upload.dto';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))

@ApiTags("QuanLyPhim")
@Controller('/api/QuanLyPhim')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get("/LayDanhSachBanner")
  @HttpCode(200)
  async getBanner(): Promise<{ statusCode: number, message: string, content: { ma_banner: number, ma_phim: number, hinh_anh: string }[]}> {
    const content = await this.movieService.getBanner();
    return {
      statusCode: 200,
      message: "Xử lý thành công!",
      content: content
    };
  }

  @Get("/LayDanhSachPhim")
  @HttpCode(200)
  @ApiQuery({ name: 'tenPhim', required: false })
  async getSearchPhim(@Query("tenPhim") tenPhim: string): Promise<{ statusCode: number, message: string, content: string | Phim[]}> {
    if (tenPhim && tenPhim.trim() !== "") {
      const content = await this.movieService.getDanhSachPhimByName(tenPhim);
      return { statusCode: 200, message: "Xử lý thành công", content: content};
    } else {
      const content = await this.movieService.getDanhSachPhim();
      return { statusCode: 200, message: "Xử lý thành công", content: content};
    }
  }

  @Get("/LayDanhSachPhimPhanTrang")
  @HttpCode(200)
  @ApiQuery({ name: 'tenPhim', required: false })
  @ApiQuery({ name: 'soTrang', type: 'integer', required: false })
  @ApiQuery({ name: 'soPhanTuTrenTrang', type: 'integer', required: false })
  async getSearchPhimPage(
    @Query("tenPhim") tenPhim: string,
    @Query("soTrang") soTrang: number = 1,
    @Query("soPhanTuTrenTrang") soPhanTuTrenTrang: number = 10
  ): Promise<{ statusCode: number, message: string, content: string | Phim[]}> {
    let content: string | Phim[];

    if (tenPhim && tenPhim.trim() !== "") {
      content = await this.movieService.getDanhSachPhimByName(tenPhim);
    } else {
      content = await this.movieService.getDanhSachPhim();
    }

    const start = (soTrang - 1) * soPhanTuTrenTrang;
    const end = start + soPhanTuTrenTrang;
    const paginatedContent = content.slice(start, end);

    return { statusCode: 200, message: "Xử lý thành công", content: paginatedContent };
  }

  @Get('/LayDanhSachPhimTheoNgay')
  @ApiQuery({ name: 'tenPhim', required: false })
  @ApiQuery({ name: 'soTrang', type: 'integer', required: false })
  @ApiQuery({ name: 'soPhanTuTrenTrang', type: 'integer', required: false })
  @ApiQuery({ name: 'tuNgay', required: false })
  @ApiQuery({ name: 'denNgay', required: false })
  async getSearchPhimByDay(
    @Query('tenPhim') tenPhim: string,
    @Query('soTrang') soTrang: number = 1,
    @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number = 10,
    @Query('tuNgay') tuNgay: string,
    @Query('denNgay') denNgay: string, 
  ): Promise<{ statusCode: number; message: string; content: { phim: Phim[], lichChieu: LichChieu[] } }> {
    const content = await this.movieService.getDanhSachPhimByDay(tenPhim, tuNgay, denNgay);
    const start = (soTrang - 1) * soPhanTuTrenTrang;
    const end = start + soPhanTuTrenTrang;
    const paginatedContent = {
      phim: content.phim.slice(start, end),
      lichChieu: content.lichChieu
    };

    return { statusCode: 200, message: 'Xử lý thành công', content: paginatedContent };
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @Post("/ThemPhimUploadHinh")
  @UseInterceptors(
    FileInterceptor("hinhAnh", 
      {
        storage: diskStorage({
          destination: process.cwd() + "/public/img",
          filename: (req, file, callback) => callback(null, new Date().getTime() + "_" + file.originalname)
        })
      }
    )
  )
  uploadFood(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  @HttpCode(200)
  @Delete("/XoaPhim")
  @ApiQuery({ name: 'ma_phim', required: false })
  async deletePhim(@Query("ma_phim") ma_phimN: string): Promise<{ statusCode: number, message: string, content: string | Phim[] }> {
    const ma_phim = parseInt(ma_phimN, 10);
    if (isNaN(ma_phim)) {
      return {
        statusCode: 400,
        message: "Dữ liệu không hợp lệ!",
        content: "Thiếu thông tin phim."
      };
    }
    const deletedUsers = await this.movieService.deletePhim(ma_phim);
    return {
      statusCode: 200,
      message: "Xóa phim thành công",
      content: deletedUsers
    };
  }

  @Get("/LayThongTinPhim")
  @ApiQuery({ name: 'MaPhim', required: false })
  @HttpCode(400)
  async getThongTinPhim(@Query("MaPhim") maPhim: string): Promise<{ statusCode: number, message: string, content: string | Phim[]}> {
    if (maPhim && maPhim.trim() !== "") {
      const maHeThongRapNumber = maPhim ? parseInt(maPhim, 10) : null;
      const content = await this.movieService.getThongTinPhim(maHeThongRapNumber);
      return { statusCode: 200, message: "Xử lý thành công", content: content};
    } else {
      return { statusCode: 400, message: "Không tìm thấy tài nguyên!", content: "Mã phim không hợp lệ!"};
    }
  }
}
