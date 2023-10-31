import { ApiProperty } from "@nestjs/swagger";
import { UploadedFile } from "express-fileupload";

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    hinhAnh: UploadedFile;
}

