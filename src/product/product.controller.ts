import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, HttpCode, Put, UploadedFile, ParseFilePipe, MaxFileSizeValidator, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductsDto, ProductDTO } from './dto/product.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'src/files/storage';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async findAll(@Query() queryDto: GetAllProductsDto) {
    return this.productService.findAll(queryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  @UseInterceptors(FileInterceptor('files', {
    storage: fileStorage
  }))
  async createProduct(@UploadedFile(
    ) file: Express.Multer.File, @Body() productDto: ProductDTO) {
    return this.productService.create(productDto, file);
  }
  
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  @UseInterceptors(FileInterceptor('files', {
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(null, false);
      }
      return cb(null, true);
    }
  }))
  async update(@Param('id') id: string, @Body() updateProductDto: ProductDTO, @UploadedFile(
    ) file?: Express.Multer.File) {
    return this.productService.update(+id, updateProductDto, file);
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
