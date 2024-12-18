import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;  

  @Column()
  description: string;  

  @Column()
  price: number; 

  @Column()
  category: string;  

  @Column({ default: true })
  available: boolean; 
}
