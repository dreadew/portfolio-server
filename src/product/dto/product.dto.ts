import { IsNumber, IsOptional, IsString, IsEnum } from "class-validator"
import { PaginationDTO } from "src/pagination/dto/pagination.dto"

export class ProductDTO {
	@IsString()
	title: string

	@IsString()
	description: string

	@IsNumber()
	price: number

	@IsString()
	imageUrl: string
}

export enum EnumProductSort {
	HIGH_PRICE = 'high-price',
	LOW_PRICE = 'low-price',
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

export class GetAllProductsDto extends PaginationDTO {
	@IsOptional()
	@IsEnum(EnumProductSort)
	sort?: EnumProductSort;

	@IsOptional()
	@IsString()
	searchTerm?: string
}