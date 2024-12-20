import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'catering',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  }),], 
  controllers: [ CustomerController], 
  providers: [CustomerService], 
  exports: [CustomerService],
})
export class CustomerModule {}
