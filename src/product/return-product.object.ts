import { Prisma } from "@prisma/client";
import { returnCategoryObject } from "src/category/return-category.object";

export const returnProductObject: Prisma.ProductSelect = {
	id: true,
	title: true,
	description: true,
	price: true,
	images: true,
	Category: {
		select: returnCategoryObject
	}
}