import { Controller, Body, Get, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { Order, Request as HistorySearch } from '../app.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  // @UseGuards(AuthGuard('local'))
  @Get()
  getAllPaidOrders(
    @Body('search') paymentChoice: string,
    @Body('datefrom') ordersDateFrom: string,
    @Body('dateto') ordersDateTo: string,
  ): Order[] | Order {
    return this.historyService.getAllPaidOrders(
      paymentChoice,
      ordersDateFrom,
      ordersDateTo,
    );
  }
}
