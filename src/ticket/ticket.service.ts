import { Injectable, HttpException } from '@nestjs/common';
import { LichChieu } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { DanhSachVeDatDto, LichChieuDto } from './dto/create-ticket.dto';


@Injectable()
export class TicketService {
  model = new PrismaClient();

  async datVe(datVeN: DanhSachVeDatDto) {
    try {
      const existingSchedule = await this.model.datVe.findFirst({
        where: {
          tai_khoan: datVeN.tai_khoan,
          ma_ghe: datVeN.ma_ghe,
          ma_lich_chieu: datVeN.ma_lich_chieu,
        },
      });
  
      if (existingSchedule) {
        throw new HttpException(
          { message: 'Chỗ ngồi đã được đặt', code: 409 },
          409,
        );
      }
        const newSchedule = await this.model.datVe.create({
        data: {
          tai_khoan: datVeN.tai_khoan,
          ma_lich_chieu: datVeN.ma_lich_chieu,
          ma_ghe: datVeN.ma_ghe,
        },
      });
  
      return {
        message: {
          data: { schedule: newSchedule },
          message: 'Đặt vé thành công',
          statusCode: 200,
        },
        code: 200,
      };
    } catch (error) {
      return new HttpException(
        error.response?.message || 'Internal Server Error',
        error.status || 500,
      );
    }
  }
  
  async getDanhSachPhongVe(maLichChieu: number) : Promise<LichChieu[]>{
    return await this.model.lichChieu.findMany({
      where: {
        ma_lich_chieu: maLichChieu
      },
      include:{
        RapPhim:{
          include:{
            CumRap:{}
          }
        },
        DatVe:{}
      }
    })
  }

  async taoLichChieu(taoLichChieuN: LichChieuDto) {
    try {
      const existingSchedule = await this.model.lichChieu.findFirst({
        where: {
          ma_rap: taoLichChieuN.ma_rap,
          ma_phim: taoLichChieuN.ma_phim,
          ngay_gio_chieu: taoLichChieuN.ngay_gio_chieu,
        },
      });
  
      if (existingSchedule) {
        throw new HttpException(
          { message: 'Lịch chiếu đã tồn tại', code: 409 },
          409,
        );
      }
        const newSchedule = await this.model.lichChieu.create({
        data: {
          ma_rap: taoLichChieuN.ma_rap,
          ma_phim: taoLichChieuN.ma_phim,
          ngay_gio_chieu: taoLichChieuN.ngay_gio_chieu,
          gia_ve: taoLichChieuN.gia_ve,
        },
      });
  
      return {
        message: {
          data: { schedule: newSchedule },
          message: 'Tạo lịch chiếu thành công',
          statusCode: 200,
        },
        code: 200,
      };
    } catch (error) {
      return new HttpException(
        error.response?.message || 'Internal Server Error',
        error.status || 500,
      );
    }
  }
}
