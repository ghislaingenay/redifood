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
import {
  EPaymentType,
  UserPayload,
} from '../../redifood-module/src/interfaces';
import { AuthGuard } from '../../src/global/auth-guard';
import { CreatePaymentDto } from './payments.dto';
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
  async payOrder(
    @Body(new ValidationPipe()) paymentDto: CreatePaymentDto,
    @User() user: UserPayload,
    @Query('paymentType') paymentType: EPaymentType,
  ) {
    return await this.paymentsService.payOrder(
      paymentDto,
      user.id,
      paymentType,
    );
  }
}
