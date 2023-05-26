import { Prisma } from "@prisma/client";

export const returnProductObject: Prisma.ProductSelect = {
	id: true,
	title: true,
	description: true,
	price: true,
	imageUrl: true
}