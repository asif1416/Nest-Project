import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  async addToCart(
    @Body()
    {
      customerId,
      menuId,
      quantity,
    }: {
      customerId: number;
      menuId: number;
      quantity: number;
    },
  ) {
    await this.cartService.addToCart(customerId, menuId, quantity);

    return {
      message: 'Item added to cart',
    };
  }

  @Delete('/remove')
  async removeFromCart(
    @Body()
    { customerId, menuItemId }: { customerId: number; menuItemId: number },
  ) {
    await this.cartService.removeFromCart(customerId, menuItemId);

    return {
      message: 'Item removed from cart',
    };
  }

  @Get('/:customerId')
  async getCart(@Param('customerId') customerId: number) {
    const cart = await this.cartService.getCart(customerId);
    if(cart.items.length === 0) {
      return {
        message: 'Cart is empty',
      };
    }
    return {
      message: 'Cart retrieved successfully',
      cart,
    };
  }

  @Delete('/clear/:customerId')
  async clearCart(@Param('customerId') customerId: number) {
    await this.cartService.clearCart(customerId);

    return {
      message: 'Cart cleared',
    };
  }
}
