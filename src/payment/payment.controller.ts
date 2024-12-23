import { Controller, Post, Body, Get, Query, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from 'src/auth/auth.decorators';

@Controller('payment')
export class PaymentController {
  constructor(private readonly sslCommerzPaymentService: PaymentService) {}

  @Post('init')
  async initPayment(@Body() data: any) {
    return await this.sslCommerzPaymentService.init(data);
  }

  @Get('validate')
  async validatePayment(@Query('val_id') val_id: string) {
    return await this.sslCommerzPaymentService.validate({ val_id });
  }

  @Get('refund')
  async refundPayment(@Body() data: any) {
    return await this.sslCommerzPaymentService.initiateRefund(data);
  }

  @Get('refund-query')
  async queryRefund(@Body() data: any) {
    return await this.sslCommerzPaymentService.refundQuery(data);
  }

  @Get('transaction-query-session')
  async queryTransactionBySessionId(@Body() data: any) {
    return await this.sslCommerzPaymentService.transactionQueryBySessionId(
      data,
    );
  }

  @Get('transaction-query-id')
  async queryTransactionByTransactionId(@Body() data: any) {
    return await this.sslCommerzPaymentService.transactionQueryByTransactionId(
      data,
    );
  }

  @Public()
  @Post('success')
  async paymentSuccess(@Req() req: any, @Res() res: any) {
      const paymentData = req.body;
      const { val_id, tran_id, status } = paymentData;

    if (status === 'VALID') {
        const validationResponse = await this.sslCommerzPaymentService.validate(val_id); 
  
        return res.status(200).json({
          message: 'Payment Successful!',
          validationData: validationResponse,
        });
    } else {
        return res.status(400).json({ message: 'Payment Failed' });
      }
  }
}
