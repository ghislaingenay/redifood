import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExtraApiDto, FoodApiDto, SectionApiDto } from 'src/foods.dto';
import { FoodService } from './foods.service';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('all')
  async getAllFoods() {
    return await this.foodService.getAllFoods();
  }

  @Get('section/:id')
  async getFoodBySectionId(@Param('id') id: number) {
    return await this.foodService.getFoodBySectionId(id);
  }

  @Post('/section')
  async createSection(@Body() sectionDto: SectionApiDto) {
    return await this.foodService.createSection(sectionDto);
  }
}
