import { Injectable } from '@nestjs/common';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { CumRap, HeThongRap, Phim, PrismaClient } from '@prisma/client';

@Injectable()
export class CinemaService {
  model = new PrismaClient();
  create(createCinemaDto: CreateCinemaDto) {
    return 'This action adds a new cinema';
  }

  findAll() {
    return `This action returns all cinema`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cinema`;
  }

  update(id: number, updateCinemaDto: UpdateCinemaDto) {
    return `This action updates a #${id} cinema`;
  }

  remove(id: number) {
    return `This action removes a #${id} cinema`;
  }

  async getRapPhim(){
    return await this.model.heThongRap.findMany();
  }

  async getRapPhimByID(maHeThongRap: number) : Promise<HeThongRap[]>{
    return await this.model.heThongRap.findMany({
      where: {
          ma_he_thong_rap: maHeThongRap
      }
    });
  }


  async getHeThongRapPhim(maHeThongRap: number): Promise<CumRap[]> {
    return await this.model.cumRap.findMany({
      where: {
        ma_he_thong_rap: maHeThongRap
      },
      include: {
        RapPhim: {
          select: {
            ma_rap: true,
            ten_rap: true,
          },
        },
      },
    });
  }

  async getLichChieuHeThong(){
    return await this.model.heThongRap.findMany({
      include:{
        CumRap:{
          include:{
            RapPhim:{
              include:{
                LichChieu: {
                  include: {
                    Phim: {
                      select: {
                        ma_phim: true,
                        ten_phim: true,
                        hinh_anh: true,
                        hot: true,
                        dang_chieu: true,
                        sap_chieu: true,
                      },
                    },
                  },
                }
              }
            }
          }
        }
      }
    })
  }

  async getLichChieuHeThongByID(maHeThongRap: number): Promise<HeThongRap[]> {
    return await this.model.heThongRap.findMany({
      where: {
        ma_he_thong_rap: maHeThongRap,
      },
      include:{
        CumRap:{
          include:{
            RapPhim:{
              include:{
                LichChieu: {
                  include: {
                    Phim: {
                      select: {
                        ma_phim: true,
                        ten_phim: true,
                        hinh_anh: true,
                        hot: true,
                        dang_chieu: true,
                        sap_chieu: true,
                      },
                    },
                  },
                }
              }
            }
          }
        }
      }
    });
  }
  

  async getLichChieuPhim(maPhim: number): Promise<Phim[]>{
    return await this.model.phim.findMany({
      where: {
        ma_phim: maPhim,
      },
      include:{
       LichChieu :{
          include:{
            RapPhim:{
              include:{
                CumRap:{
                  include:{
                    HeThongRap: {}
                  }
                }
              }
            }
          }
        }
      }
    })
  }
}
