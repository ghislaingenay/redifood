import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Order } from './app.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAllOrders() {
    const allOrders = await this.appService.getAllOrders();
    // return allOrders
  }
}
