import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async getAllMenuItems(): Promise<Menu[]> {
    return this.menuRepository.find({ where: { available: true } });
  }

  async getMenuItemsByCategory(category: string): Promise<Menu[]> {
    return this.menuRepository.find({ where: { category, available: true } });
  }

  async getMenuItemById(id: number): Promise<Menu> {
    return this.menuRepository.findOne({ where: { id } });
  }
}
