import { Module } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaController } from './cinema.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [CinemaController],
  providers: [CinemaService, JwtStrategy],
})
export class CinemaModule {}
