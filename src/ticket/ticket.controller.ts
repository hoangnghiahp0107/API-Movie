import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { DanhSachVeDatDto, LichChieuDto } from './dto/create-ticket.dto';
import { LichChieu } from '@prisma/client';
import { ApiQuery, ApiTags, ApiBody, ApiHeader, ApiBearerAuth } from '@nestjs/swagger/dist';
import { HttpCode } from '@nestjs/common';
import { DanhSachVeDat, LichChieuInsert } from './entities/ticket.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@ApiTags("QuanLyDatVe")
@Controller('/api/QuanLyDatVe')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @HttpCode(200)
  @ApiBody({
    type: DanhSachVeDat,
  })
  @Post('/DatVe')
  datVe(@Body() body: DanhSachVeDatDto, @Req() req: Request) {
    return this.ticketService.datVe(body);
  }

  @Get("/LayDanhSachPhongVe")
  @ApiQuery({ name: 'MaLichChieu', required: false })
  @HttpCode(200) 
  async getHeThongRapPhim(@Query("MaLichChieu") maLichChieu: string): Promise<{ statusCode: number, message: string, content: string | LichChieu[]}> {
    if (!maLichChieu || maLichChieu.trim() === "") {
      return {
        statusCode: 400,
        message: "Dữ liệu không hợp lệ!",
        content: "Mã lịch chiếu không hợp lệ!"
      };
    } else {
      const maLichChieuNumber = parseInt(maLichChieu, 10);
      const content = await this.ticketService.getDanhSachPhongVe(maLichChieuNumber);
      if (!content || content.length === 0) {
        return {
          statusCode: 500,
          message: "Dữ liệu không hợp lệ!",
          content: "Mã lịch chiếu không tồn tại!"
        };
      }
      return {
        statusCode: 200,
        message: "Xử lý thành công",
        content: content
      };
    }
  }

  @HttpCode(200)
  @ApiBody({
    type: LichChieuInsert,
  })
  @Post('/TaoLichChieu')
  taoLichChieu(@Body() body: LichChieuDto, @Req() req: Request) {
    return this.ticketService.taoLichChieu(body);
  }
}
