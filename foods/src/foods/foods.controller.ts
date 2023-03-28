import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TUser } from 'redifood-module/src/interfaces';
import { AuthGuard } from 'src/handling/auth-guard';
import { User } from 'src/handling/user-decorator';
import { ExtraApiDto, FoodApiDto, SectionApiDto } from '../foods.dto';
import { ValidationPipe } from '../handling/validation.pipe';
import { FoodService } from './foods.service';

@Controller('api/foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('all')
  async getAllFoods() {
    return await this.foodService.getAllFoods();
  }

  @Get('section/:id')
  async getFoodBySectionId(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.foodService.getFoodBySectionId(id);
  }

  @UseGuards(AuthGuard)
  @Post('section')
  async createSection(
    @Body(new ValidationPipe()) sectionDto: SectionApiDto,
    @User() userInfo: TUser,
  ) {
    console.log('user info', userInfo);
    return await this.foodService.createSection(sectionDto);
  }

  @Post('extra')
  async createExtra(@Body(new ValidationPipe()) extraDto: ExtraApiDto) {
    return await this.foodService.createExtra(extraDto);
  }

  @Post()
  async createFood(@Body(new ValidationPipe()) foodDto: FoodApiDto) {
    return await this.foodService.createFood(foodDto);
  }

  @Put()
  async updateFood(@Body(new ValidationPipe()) foodDto: FoodApiDto) {
    return await this.foodService.updateFood(foodDto);
  }

  @Delete('extra/:id')
  async deleteExtra(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.foodService.deleteExtra(id);
  }

  @Delete('section/:id')
  async deleteSection(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.foodService.deleteSection(id);
  }

  @Delete('food/:id')
  async deleteFood(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.foodService.deleteFood(id);
  }
}
