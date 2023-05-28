import { IsNumber, IsOptional, IsString, IsEnum, ArrayMinSize } from "class-validator"
import { PaginationDTO } from "src/pagination/dto/pagination.dto"

export class ProductDTO {
	title: string

	description: string

	price: number

	categoryId: number
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