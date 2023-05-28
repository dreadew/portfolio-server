import { IsString, IsEmail, MinLength, Length, IsOptional } from "class-validator"

export class CreateUserDto {
	@IsString()
	name: string

	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, {
		message: 'password must be at least 6 characters long'
	})
	password: string

	@Length(4)
	@IsOptional()
	code: string
}
