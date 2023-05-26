import { IsEnum, IsNumber, IsString, ArrayMinSize, IsOptional } from "class-validator";

export class OrderDTO {
	@IsOptional()
	status: string;

	@ArrayMinSize(1)
	items: OrderItemDTO[]
}

export class OrderItemDTO {
	@IsNumber()
	quantity: number;

	@IsNumber()
	price: number;

	@IsNumber()
	productId: number;
}