import { Body, Controller, Get, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: any) {
    /*const response = res.sendFile(filename, { root: './uploads' });
    if (!response) {
      throw new NotFoundException('Файл не найден');
    }*/
    return res.sendFile(filename, { root: './uploads' });
  }

  /*@Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: fileStorage
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  create(@UploadedFile(
    new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })]
    })
  ) file: Express.Multer.File) {
    return this.filesService.create(file);
  }*/
}
