import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, HttpCode, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductsDto, ProductDTO } from './dto/product.dto';
import { Auth } from 'src/users/decorators/auth.decorator';

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
  async createProduct(@Body() productDto: ProductDTO) {
    return this.productService.create(productDto);
  }
  
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async update(@Param('id') id: string, @Body() updateProductDto: ProductDTO) {
    return this.productService.update(+id, updateProductDto);
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
