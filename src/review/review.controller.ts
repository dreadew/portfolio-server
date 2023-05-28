import { Body, Controller, Delete, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/users/decorators/auth.decorator';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { ReviewDTO } from './review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll() {
    return this.reviewService.getAll();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('leave/:productId')
  @Auth()
  async leaveReview(@CurrentUser('id') id: number, @Body() dto: ReviewDTO, @Param('productId') productId: string) {
    return this.reviewService.create(id, dto, +productId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async deleteReview(@Param('id') id: string) {
    return this.reviewService.delete(id);
  }
}
