import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ExtraApiDto, FoodApiDto, SectionApiDto } from '../foods.dto';
import { ValidationPipe } from '../handling/validation.pipe';
import { FoodService } from './foods.service';

@Controller('foods')
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

  @Post('/section')
  async createSection(@Body(new ValidationPipe()) sectionDto: SectionApiDto) {
    return await this.foodService.createSection(sectionDto);
  }

  @Post('/extra')
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
}
