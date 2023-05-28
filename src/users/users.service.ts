import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.generateTokens(user.id);
    
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  async create(createUserDto: CreateUserDto) {
    const uniqueUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email
      }
    })

    if (uniqueUser)
      throw new BadRequestException('Пользователь с таким адресом эл. почты уже зарегистрирован');

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: await hash(createUserDto.password),
        code: Math.floor(1000 + Math.random() * 9000).toString()
      }
    });

    const tokens = await this.generateTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens
    };
  }

  async generateNewAccessToken(refreshToken: string) {
    const res = await this.jwt.verifyAsync(refreshToken);

    if (!res) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findUnique({
      where: {
        id: res.id
      }
    });

    const tokens = this.generateTokens(user.id);

    return {
      user: this.returnUserFields,
      ...tokens
    }
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id
      },
      data: {
          ...updateUserDto
      }
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: {
        id
      }
    });
  }

  private generateTokens(id: number) {
    const data = { id: id }

    const accessToken = this.jwt.sign(data,
      {expiresIn: '1h'});
    
    const refreshToken = this.jwt.sign(data, {expiresIn:
    '7d'});

    return { accessToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }

  private async validateUser(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new UnauthorizedException('Неверный логин или пароль');

    return user;
  }
}
