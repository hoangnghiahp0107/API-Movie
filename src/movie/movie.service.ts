import { Injectable } from '@nestjs/common';
import { LichChieu, Phim, PrismaClient } from '@prisma/client';

@Injectable()
export class MovieService {
  model = new PrismaClient();

  async getBanner(){
    return await this.model.banner.findMany();
  }

  async getDanhSachPhim(){
    return await this.model.phim.findMany();
  }

  async getDanhSachPhimByName(tenPhim: string) : Promise<Phim[]>{
    return await this.model.phim.findMany({
      where:{
        OR: [
          {ten_phim: {contains: tenPhim}}
        ]
      }
    })
  }

  async getThongTinPhim(maPhim: number): Promise<Phim[]>{
    return await this.model.phim.findMany({
      where: {
        ma_phim: maPhim
      }
    });
  } 

  async getDanhSachPhimByDay(tenPhim: string, tuNgay: string, denNgay: string): Promise<{ phim: Phim[], lichChieu: LichChieu[] }> {
    const phimQuery = this.model.phim.findMany({
      where: {
        OR: [{ ten_phim: { contains: tenPhim } }],
      },
    });
  
    const ngayGioChieuQuery = this.model.lichChieu.findMany({
      where: {
        ngay_gio_chieu: {
          gte: new Date(tuNgay),
          lte: new Date(denNgay),
        },
      },
    });
  
    const [phimResult, ngayGioChieuResult] = await Promise.all([phimQuery, ngayGioChieuQuery]);
    
    return { phim: phimResult, lichChieu: ngayGioChieuResult };
  }

  async deletePhim(ma_phim: number): Promise<any> {
    await this.model.banner.deleteMany({
      where: {
        ma_phim: ma_phim
      }
    });
    await this.model.lichChieu.deleteMany({
      where: {
        ma_phim: ma_phim
      }
    });
    const deletedResult = await this.model.phim.delete({
      where: {
        ma_phim: ma_phim
      }
    });
    return deletedResult;
  }
}
