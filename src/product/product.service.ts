import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnProductObject } from './return-product.object';
import { EnumProductSort, GetAllProductsDto, ProductDTO } from './dto/product.dto';
import { Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService, private readonly paginationService: PaginationService) {
    
  }

  async create(createProductDto: ProductDTO) {
    const product = await this.prisma.product.create({
      data: {
        title: createProductDto.title,
        description: createProductDto.description,
        price: createProductDto.price,
        imageUrl: createProductDto.imageUrl
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

    if (!product) throw new NotFoundException('Product not found');

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

  async update(id: number, updateProductDto: ProductDTO) {
    return await this.prisma.product.update({
      where: {
        id
      },
      data: {
        ...updateProductDto
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
