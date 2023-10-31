import { PartialType } from '@nestjs/swagger';
import { LichChieuInsert } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(LichChieuInsert) {}
