import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnProductObject } from './return-product.object';
import { EnumProductSort, GetAllProductsDto, ProductDTO } from './dto/product.dto';
import { Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
import { convertToSlug } from 'utils/generateSlug';
import { FilesService } from 'src/files/files.service';
import { join } from 'path';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService, private readonly paginationService: PaginationService, private readonly fileService: FilesService) {
    
  }

  async create(createProductDto: ProductDTO, file: Express.Multer.File) {
    const uploaded_file: string[] = [];
    uploaded_file.push((await this.fileService.create(file)).filename);

    const product = await this.prisma.product.create({
      data: {
        title: createProductDto.title,
        description: createProductDto.description,
        price: +createProductDto.price,
        images: uploaded_file,
        slug: convertToSlug(createProductDto.title),
        categoryId: +createProductDto.categoryId
      }
    });

    return product.id;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id
      },
      select: returnProductObject
    });

    if (!product) throw new NotFoundException('Товар не найден');

    return product;
  }

  async findAll(dto: GetAllProductsDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    if (sort === EnumProductSort.HIGH_PRICE)
      prismaSort.push({price: 'desc'});
    if (sort === EnumProductSort.LOW_PRICE)
      prismaSort.push({price: 'asc'});
    if (sort === EnumProductSort.NEWEST)
      prismaSort.push({createdAt: 'desc'});
    if (sort === EnumProductSort.OLDEST)
      prismaSort.push({createdAt: 'asc'});

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm ? {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive'
          },
          description: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        }
      ]
    } : {}

    const { perPage, skip } = this.paginationService.getPagination(dto);

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      select: returnProductObject,
      orderBy: prismaSort,
      skip,
      take: perPage,
    });

    return products; /*{
      products,
      length: await this.prisma.product.count({
        where: prismaSearchTermFilter
      })
    };*/
  }

  async update(id: number, updateProductDto: ProductDTO, file?: Express.Multer.File) {
    const { description, price, title } = updateProductDto
    
    if (file) {
      const uploaded_file: string[] = [];
      uploaded_file.push((await this.fileService.create(file)).filename);
      return await this.prisma.product.update({
        where: {
          id
        },
        data: {
          description,
          price: +price,
          title,
          slug: convertToSlug(title),
          images: uploaded_file,
          Category: {
            connect: {
              id: +updateProductDto.categoryId
            }
          }
        }
      });
    }

    return await this.prisma.product.update({
      where: {
        id
      },
      data: {
        description,
        price: +price,
        title,
        slug: convertToSlug(title),
        Category: {
          connect: {
            id: +updateProductDto.categoryId
          }
        }
      }
    });
  }

  async remove(id: number) {
    return await this.prisma.product.delete({
      where: {
        id
      }
    });
  }
}
