import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [AuthModule, CustomerModule, MenuModule, OrderModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
