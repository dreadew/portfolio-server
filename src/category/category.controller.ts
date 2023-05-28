import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/users/decorators/auth.decorator';
import { CategoryDto } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.categoryService.byId(+id);
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.categoryService.byId(+slug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(":categoryId")
  async update(@Param("categoryId") categoryId: string, @Body() dto: CategoryDto) {
    return this.categoryService.update(+categoryId, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async create(@Body() dto: CategoryDto) {
    return this.categoryService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Delete(":categoryId")
  async delete(@Param("categoryId") categoryId: string) {
    return this.categoryService.delete(+categoryId);
  }
}
