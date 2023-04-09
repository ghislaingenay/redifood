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
} from '@nestjs/common';
import { CreatePictureDto } from 'src/dto/create-picture.dto';
import { TUser } from '../../redifood-module/src/interfaces';
import { User } from '../../src/handling/user-decorator';
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

  @Put(':id')
  async updateFood(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body(new ValidationPipe()) foodDto: FoodApiDto,
  ) {
    return await this.foodService.updateFood(foodDto, id);
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

  @Post('test-ms')
  async handleCreatePicture(@Body() createPictureDto: CreatePictureDto) {
    return await this.handleCreatePicture(createPictureDto);
  }
  @Post('pit')
  async info(@Body() dto: any) {
    return { ...dto, status: 'yes' };
  }
}
