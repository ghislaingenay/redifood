import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'redifood-module/src/handling-nestjs/user-decorator';
import { UserPayload } from '../../redifood-module/src/interfaces';
import { AuthGuard } from '../../src/global/auth-guard';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(new AuthGuard())
  @Get('id')
  async getPaymentByOrderId(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    orderId: number,
    @User() user: UserPayload,
  ) {
    return await this.paymentsService.getPaymentByOrderId(orderId, user.id);
  }

  // paidOrder
  @UseGuards(new AuthGuard())
  @Post()
  // Might be obtained from callback of stripe payment
  async payOrder(
    @Body(new ValidationPipe()) paymentDto: any,
  ) {
    return await this.paymentsService.payOrder(paymentDto);
  }
}
