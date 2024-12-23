import { Injectable, Inject } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PAYMENT_CONFIG } from './payment.constants';
import { PaymentConfig } from './payment.config';

@Injectable()
export class SSLCommerzPayment extends PaymentService {
  constructor(
    @Inject(PAYMENT_CONFIG) config: PaymentConfig
  ) {
    super(config);
  }
}