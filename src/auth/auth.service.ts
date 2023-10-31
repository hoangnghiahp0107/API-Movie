import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { NguoiDung } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login-auth.dto';
import { SignUpDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { } 
  model = new PrismaClient();
  async login(userLogin: LoginDto) {
    try {
      const user = await this.model.nguoiDung.findFirst({
        where: {
          email: userLogin.email,
        },
      });
      if (!user) {
        throw new HttpException(
          { message: `Email không tồn tại: ${userLogin.email}`, code: 404 },
          404,
        );
      } else {
        if (bcrypt.compareSync(userLogin.mat_khau, user.mat_khau)) {
          try {
            const token = await this.jwtService.signAsync(
              { data: user },
              { secret: this.configService.get('KEY'), expiresIn: '200m' },
            );
            const { mat_khau: pw, ...usWithoutPw } = user;
            throw new HttpException(
              {
                message: {
                  data: { user: usWithoutPw, token: `Bearer ${token}` },
                  message: 'Đăng nhập thành công',
                  statusCode: 200,
                },
                code: 200,
              },
              200,
            );
          } catch (error) {
            throw error;
          }
        } else {
          throw new HttpException(
            { message: 'Sai mật khẩu', code: 400 },
            400,
          );
        }
      }
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.status != 500 ? error.response.code : 500,
      );
    }
  }

  async signUp(userSignUp: SignUpDto) {
    try {
      const checkUser = await this.model.nguoiDung.findFirst({
        where: {
          email: userSignUp.email,
        },
      });
      if (checkUser) {
        throw new HttpException(
          { message: 'Email đã tồn tại', code: 409 },
          409,
        );
      } else {
        const newUser = {
          ...userSignUp,
          mat_khau: bcrypt.hashSync(userSignUp.mat_khau, 10),
          loai_nguoi_dung: userSignUp.loai_nguoi_dung || 'user', 
        };
        const us = await this.model.nguoiDung.create({ data: newUser });
        const { mat_khau: pw, ...newUserWithoutPw } = us;
        return {
          message: {
            data: { user: newUserWithoutPw },
            message: 'Đăng ký thành công',
            statusCode: 200,
          },
          code: 200,
        };
      }
    } catch (error) {
      return new HttpException(
        error.response?.message || 'Internal Server Error',
        error.status || 500,
      );
    }
  }

  async signUpND(userSignUp: SignUpDto) {
    try {
      const checkUser = await this.model.nguoiDung.findFirst({
        where: {
          email: userSignUp.email,
        },
      });
      if (checkUser) {
        throw new HttpException(
          { message: 'Email đã tồn tại', code: 409 },
          409,
        );
      } else {
        const newUser = {
          ...userSignUp,
          mat_khau: bcrypt.hashSync(userSignUp.mat_khau, 10),
        };
        const us = await this.model.nguoiDung.create({ data: newUser });
        const { mat_khau: pw, ...newUserWithoutPw } = us;
        return {
          message: {
            data: { user: newUserWithoutPw },
            message: 'Đăng ký thành công',
            statusCode: 200,
          },
          code: 200,
        };
      }
    } catch (error) {
      return new HttpException(
        error.response?.message || 'Internal Server Error',
        error.status || 500,
      );
    }
  }
  
  async updateUser(userSignUp: SignUpDto) {
    try {
      const existingUser = await this.model.nguoiDung.findFirst({
        where: {
          email: userSignUp.email,
        },
      });
  
      if (!existingUser) {
        throw new HttpException(
          { message: 'Người dùng không tồn tại', code: 404 },
          404,
        );
      }

      const updatedUser = {
        ...existingUser,
        ...userSignUp,
        mat_khau: bcrypt.hashSync(userSignUp.mat_khau, 10),
      };
  
      const updatedUserProfile = await this.model.nguoiDung.update({
        where: {
          tai_khoan: existingUser.tai_khoan, 
        },
        data: updatedUser,
      });
  
      const { mat_khau: pw, ...updatedUserWithoutPw } = updatedUserProfile;
  
      return {
        message: {
          data: { user: updatedUserWithoutPw },
          message: 'Cập nhật thông tin người dùng thành công',
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
 
  async getUser(){
    return await this.model.nguoiDung.findMany();
  }

  async getSearchUser(tuKhoa: string): Promise<NguoiDung[]> {
    return await this.model.nguoiDung.findMany({
      where: {
        OR: [
          { ho_ten: { contains: tuKhoa } },
          { mat_khau: { contains: tuKhoa } },
          { email: { contains: tuKhoa } },
          { so_dt: { contains: tuKhoa } },
          { loai_nguoi_dung: { contains: tuKhoa}}
        ],
      },
    });
  }

  async getUserPage(page: number, pageSize: number): Promise<{ data: NguoiDung[], total: number }> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const [data, total] = await Promise.all([
      this.model.nguoiDung.findMany({
        skip,
        take,
      }),
      this.model.nguoiDung.count(),
    ]);
    return { data, total };
  }

  async deleteUser(tai_khoan: number): Promise<any> {
    await this.model.datVe.deleteMany({
      where: {
        tai_khoan: tai_khoan
      }
    });
  
    const deletedResult = await this.model.nguoiDung.delete({
      where: {
        tai_khoan: tai_khoan
      }
    });
  
    return deletedResult;
  }
}
