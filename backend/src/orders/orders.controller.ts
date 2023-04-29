import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Menu, Order, Food, Section } from '../app.interface';
import { OrderDto } from 'src/app.dto';
// import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // @UseGuards(AuthGuard('local'))
  // Render the food & section in the page "/orders/create"
  @Get('create')
  recoverFoodAndSection(): { foods: Food[]; section: Section[] } {
    return this.ordersService.recoverFoodAndSection();
  }

  // @UseGuards(AuthGuard('local'))
  // Recover the information for one compte order
  @Get(':id')
  async renderOrder(@Param('id') id: string): Order {
    // const oneOrder = await this.ordersService.renderOrder(id);
    // return oneOrder;
  }

  // @UseGuards(AuthGuard('local'))
  // Create a new order from "/orders/create"
  @Post('create')
  // Change function to return a boolean to connect with FE
  async createOrder(@Body() dto: OrderDto): void {
    await this.ordersService.createOrder(dto);
  }

  // @UseGuards(AuthGuard('local'))
  // Patch the selected order in DB
  @Patch(':id/edit')
  updateOrder(@Body() dto: OrderDto): Order {
    return this.ordersService.updateOrder(dto);
  }
}
