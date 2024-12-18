import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from 'src/customer/customer.entity';
import { Menu } from 'src/menu/menu.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Menu)
  @JoinColumn({ name: 'menu_id' })
  menuItem: Menu;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  totalPrice: number;  

  @Column({ default: 'pending' })
  status: string; 
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;
}
