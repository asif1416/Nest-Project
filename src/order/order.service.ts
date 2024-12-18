import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { MenuService } from '../menu/menu.service';
import { CustomerService } from './../customer/customer.service';
import { UpdateOrderDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly menuService: MenuService,
    private readonly customerService: CustomerService,
  ) {}

  async createOrder(customerId: number, menuItemId: number, quantity: number, startTime?: string,
    endTime?: string,): Promise<Order> {
    const customer = await this.customerService.getCustomerById(customerId);
    if(!customer){throw new NotFoundException('User not found');}
    
    const menuItem = await this.menuService.getMenuItemById(menuItemId);
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    const totalPrice = menuItem.price * quantity;

    const order = this.orderRepository.create({
      customer, 
      menuItem, 
      quantity,
      totalPrice,
      startTime: startTime ? new Date(startTime) : undefined,
    endTime: endTime ? new Date(endTime) : undefined,
    });

    return this.orderRepository.save(order);
  }

  async cancelOrder(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({where: {id: orderId}});
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = 'cancelled';
    return this.orderRepository.save(order);
  }

  async getOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({where: {id: orderId}});
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateOrder(orderId: number, updateData: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({where: {id: orderId}});
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    Object.assign(order, updateData);
    return this.orderRepository.save(order);
  }
}
