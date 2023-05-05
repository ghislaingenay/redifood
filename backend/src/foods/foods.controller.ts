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
import { AuthGuard } from 'redifood-module/src/handling-nestjs/auth-guard';
import { User } from 'src/auth/user-decorator';
import { ValidationPipe } from '../../redifood-module/src/handling-nestjs/validation.pipe';
import { TUser } from '../../redifood-module/src/interfaces';
import {
  CreateExtraDto,
  CreateFoodDto,
  CreateSectionDto,
  UpdateFoodDto,
} from './foods.dto';
import { FoodService } from './foods.service';

@Controller('api/foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @UseGuards(new AuthGuard())
  @Get('all')
  async getAllFoods() {
    return await this.foodService.getAllFoods();
  }

  @UseGuards(new AuthGuard())
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

  @UseGuards(new AuthGuard())
  @Post('section')
  async createSection(
    @Body(new ValidationPipe()) sectionDto: CreateSectionDto,
    @User() userInfo: TUser,
  ) {
    console.log('user info', userInfo);
    return await this.foodService.createSection(sectionDto);
  }

  @UseGuards(new AuthGuard())
  @Post('extra')
  async createExtra(@Body(new ValidationPipe()) extraDto: CreateExtraDto) {
    return await this.foodService.createExtra(extraDto);
  }

  @UseGuards(new AuthGuard())
  @Post()
  async createFood(@Body(new ValidationPipe()) foodDto: CreateFoodDto) {
    return await this.foodService.createFood(foodDto);
  }

  @UseGuards(new AuthGuard())
  @Put(':id')
  async updateFood(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body(new ValidationPipe()) foodDto: UpdateFoodDto,
  ) {
    return await this.foodService.updateFood(foodDto, id);
  }

  @UseGuards(new AuthGuard())
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

  @UseGuards(new AuthGuard())
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

  @UseGuards(new AuthGuard())
  @Delete(':id')
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
