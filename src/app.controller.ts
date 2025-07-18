import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService, SigninResponse } from './auth/auth.service';
import { ProductsService } from './products/products.service';
import { CreateShoppingCartDto } from './shopping-cart/create-shopping-cart.dto';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';
import { ShoppingOrderService } from './shopping-order/shopping-order.service';
import { ShoppingOrderEntity } from './shopping-order/shopping-order.entity';
import { ShoppingCartEntity } from './shopping-cart/shopping-cart.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
    private readonly cartService: ShoppingCartService,
    private readonly shoppingOrderService: ShoppingOrderService,
    
  ) { }

  @Post('/ecom/login')
  async signin(
    @Body() data: { username: string; password: string },
  ): Promise<SigninResponse> {
    console.log('data in controller:', data);
    return await this.authService.signin(data);
  }

  @Post('/ecom/search-products')
  async searchProducts(@Body() data: { keyword: string; offset: number }) {
    console.log('data in controller:', data);
    return await this.productsService.searchProducts(data);
  }

  @Get('/ecom/last6/:memCode')
  async getLast6Orders(@Param('memCode') memCode: string): Promise<ShoppingOrderEntity[]> {
    return this.shoppingOrderService.getLast6OrdersByMemberCode(memCode);
  }

  @Get('/ecom/cart/:mem_code')
  async getCartByMember(@Param('mem_code') mem_code: string) {
    return this.cartService.getProductCart(mem_code);
  }

  @Post('/ecom/cart')
  async addCart(@Body() dto: CreateShoppingCartDto) {
    try {
      console.log("SUCCESS")
      return this.cartService.createShoppingCart(dto);
    } catch (error) {
      console.log("FAIL")
      console.log(error)
      throw new Error(error);
    }
  }

// @Put('/ecom/cart/:spc_id')
// async updateCartItem(
//   @Param('spc_id', ParseIntPipe) spc_id: number,
//   @Body() updateDto: UpdateCartDto, // ใช้ DTO ที่กำหนดชัดเจน
// ) {
//   return this.cartService.updateCart(spc_id, updateDto);
// }

  @Delete('/ecom/cart/remove')
  async deleteCart(@Body() dto: ShoppingCartEntity) {
    return this.cartService.deleteCart(dto);
  }

  @Get('/ecom/product-cart')
  async cartPage(@Param('mem_code') mem_code: string) {
    return this.cartService.getProductCart(mem_code);
  }
  @Get('/ecom/product-coin')
  async productCoin() {
    return await this.productsService.listFree();
  }
}
