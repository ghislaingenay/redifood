import { Controller, Delete, Post, Get, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { FoodService } from './foods.service';
import { Food, Section } from 'src/app.interface';
import { AuthGuard } from '@nestjs/passport';
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @UseGuards(AuthGuard('local'))
  // Recover the all foods and section from DB
  @Get()
  recoverFoodAndSection(): { foods: Food[]; section: Section[] } {
    return this.foodService.recoverFoodAndSection();
  }

  @UseGuards(AuthGuard('local'))
  // Delete one section from the FE and update DB of foods as well
  @Delete('delete/section')
  deleteSection(@Body('deleteSection') removeSection: string): {
    foods: Food[];
    section: Section[];
  } {
    return this.foodService.deleteSection(removeSection);
  }

  @UseGuards(AuthGuard('local'))
  // Delete one section from the FE and update DB of foods as well
  @Delete('delete/extra')
  deleteExtra(@Body('deleteExtra') removeExtra: string): {
    foods: Food[];
    section: Section[];
  } {
    return this.foodService.deleteExtra(removeExtra);
  }

  @UseGuards(AuthGuard('local'))
  //Delete a food with a specific id
  @Delete(':id/delete')
  deleteFood(@Param('id') foodId: Food) {
    return this.foodService.deleteFood(foodId);
  }

  @UseGuards(AuthGuard('local'))
  @Patch()
  updateFood(
    @Body('_id') foodId: string,
    @Body('name') foodName: string,
    @Body('photo') foodPhoto: string,
    @Body('description') foodDescription: string,
    @Body('price') foodPrice: number,
    @Body('section') foodSection: string,
    @Body('extra') foodExtra: string,
  ): Food {
    return this.foodService.updateFood(
      foodId,
      foodName,
      foodPhoto,
      foodPrice,
      foodDescription,
      foodSection,
      foodExtra,
    );
  }
}
