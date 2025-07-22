import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { ShoppingCartEntity } from './shopping-cart.entity';
// import { Repository } from 'typeorm';
// import { CreateShoppingCartDto } from './create-shopping-cart.dto';
// import { MemberEntity } from 'src/members/members.entity';
import { ProductEntity } from 'src/products/products.entity';
// import { CreateProductDto } from 'src/products/create-product.dto';
import { CreateShoppingCartDto } from './create-shopping-cart.dto';
import { UserEntity } from 'src/users/users.entity';

import { ShoppingCartEntity } from './shopping-cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
export interface ShoppingProductCart {
  pro_code: string;
  pro_name: string;
  pro_imgmain: string;
  pro_priceA: string;
  pro_priceB: string;
  pro_priceC: string;
  pro_unit1: string;
  pro_unit2: string;
  pro_unit3: string;
  pro_ratio1: number;
  pro_ratio2: number;
  pro_ratio3: number;
  shopping_cart: ShoppingCart[];
}

export interface ShoppingCart {
  spc_id: number;
  spc_amount: string;
  spc_checked: number;
  spc_unit: string;
}

interface RawProductCart {
  pro_code: string;
  pro_name: string;
  pro_imgmain: string;
  pro_priceA: string;
  pro_priceB: string;
  pro_priceC: string;
  pro_unit1: string;
  pro_unit2: string;
  pro_unit3: string;
  pro_ratio1: number;
  pro_ratio2: number;
  pro_ratio3: number;
  spc_id: number;
  spc_amount: string;
  spc_unit: string;
  spc_checked: number;
}

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCartEntity)
    private readonly shoppingCartRepo: Repository<ShoppingCartEntity>,
    @InjectRepository(UserEntity) // 👈 ใส่แบบนี้
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) { }

  async addProductCart(data: {
    mem_code: string;
    pro_code: string;
    pro_unit: string;
    amount: number;
  }): Promise<ShoppingProductCart[]> {
    try {
      const existing = await this.shoppingCartRepo.findOne({
        where: {
          mem_code: data.mem_code,
          pro_code: data.pro_code,
          spc_unit: data.pro_unit,
        },
      });
      if (existing && Number(existing.spc_amount) + data.amount > 0) {
        const spc_amount = Number(existing.spc_amount) + data.amount;
        await this.shoppingCartRepo.update(
          { spc_id: existing.spc_id },
          {
            spc_amount: spc_amount,
            spc_datetime: Date(),
          },
        );
        return await this.getProductCart(data.mem_code);
      } else if (existing && Number(existing.spc_amount) + data.amount <= 0) {
        await this.shoppingCartRepo.delete({ spc_id: existing.spc_id });
        return await this.getProductCart(data.mem_code);
      } else {
        const updateData = {
          pro_code: data.pro_code,
          mem_code: data.mem_code,
          spc_unit: data.pro_unit,
          spc_amount: data.amount,
          spc_datetime: Date(),
        };
        await this.shoppingCartRepo.save(updateData);
        return await this.getProductCart(data.mem_code);
      }
    } catch (error) {
      console.error('Error saving product cart:', error);
      throw new Error(`Error in Add product Cart`);
    }
  }

  async checkedProductCart(data: {
    pro_code: string;
    mem_code: string;
    type: string;
  }): Promise<ShoppingProductCart[]> {
    try {
      if (data.type === 'check') {
        await this.shoppingCartRepo.update(
          {
            pro_code: data.pro_code,
            mem_code: data.mem_code,
          },
          {
            spc_checked: true,
          },
        );
        return await this.getProductCart(data.mem_code);
      } else if (data.type === 'uncheck') {
        await this.shoppingCartRepo.update(
          {
            pro_code: data.pro_code,
            mem_code: data.mem_code,
          },
          {
            spc_checked: false,
          },
        );
        return await this.getProductCart(data.mem_code);
      } else {
        throw new Error('Somthing wrong in checkedProductCart');
      }
    } catch {
      throw new Error('Somthing wrong in checkedProductCart');
    }
  }

  async handleGetCartToOrder(
    mem_code: string,
  ): Promise<ShoppingCartEntity[] | undefined> {
    try {
      return await this.shoppingCartRepo.find({
        where: {
          mem_code: mem_code,
          spc_checked: true,
        },
        relations: ['product'],
      });
    } catch {
      throw new Error('Somthing wrong in handleGetCartToOrder');
    }
  }

  async handleDeleteCart(data: {
    pro_code: string;
    mem_code: string;
  }): Promise<ShoppingProductCart[]> {
    try {
      await this.shoppingCartRepo.delete({
        pro_code: data.pro_code,
        mem_code: data.mem_code,
      });
      return await this.getProductCart(data.mem_code);
    } catch {
      throw new Error('Somthing wrong in delete product cart');
    }
  }

  async clearCheckoutCart(spc_id: number) {
    try {
      await this.shoppingCartRepo.delete(spc_id);
    } catch {
      throw new Error('Clear Checkout Cart Failed');
    }
  }

  async checkedProductCartAll(data: {
    mem_code: string;
    type: string;
  }): Promise<ShoppingProductCart[]> {
    try {
      if (data.type === 'check') {
        await this.shoppingCartRepo.update(
          {
            mem_code: data.mem_code,
          },
          {
            spc_checked: true,
          },
        );
        return await this.getProductCart(data.mem_code);
      } else if (data.type === 'uncheck') {
        await this.shoppingCartRepo.update(
          {
            mem_code: data.mem_code,
          },
          {
            spc_checked: false,
          },
        );
        return await this.getProductCart(data.mem_code);
      } else {
        throw new Error('Somthing wrong in checkedProductCartAll');
      }
    } catch {
      throw new Error('Somthing wrong in checkedProductCartAll');
    }
  }

  async getCartItemCount(mem_code: string): Promise<number> {
    try {
      const result = await this.shoppingCartRepo
        .createQueryBuilder('cart')
        .where('cart.mem_code = :mem_code', { mem_code })
        .select('COUNT(DISTINCT cart.pro_code)', 'total')
        .getRawOne<{ total: string }>();

      if (result) {
        return parseInt(result.total, 10);
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error getting cart item count:', error);
      throw new Error('Error in getCartItemCount');
    }
  }

  async getProductCart(mem_code: string): Promise<ShoppingProductCart[]> {
    try {
      const raw: RawProductCart[] = await this.shoppingCartRepo
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.product', 'product')
        .where('cart.mem_code = :mem_code', { mem_code })
        .select([
          'product.pro_code AS pro_code',
          'product.pro_name AS pro_name',
          'product.pro_imgmain AS pro_imgmain',
          'product.pro_priceA AS pro_priceA',
          'product.pro_priceB AS pro_priceB',
          'product.pro_priceC AS pro_priceC',
          'product.pro_unit1 AS pro_unit1',
          'product.pro_unit2 AS pro_unit2',
          'product.pro_unit3 AS pro_unit3',
          'product.pro_ratio1 AS pro_ratio1',
          'product.pro_ratio2 AS pro_ratio2',
          'product.pro_ratio3 AS pro_ratio3',
          'cart.spc_id AS spc_id',
          'cart.spc_amount AS spc_amount',
          'cart.spc_unit AS spc_unit',
          'cart.spc_checked AS spc_checked',
        ])
        .orderBy('product.pro_code', 'ASC')
        .getRawMany<RawProductCart>();

      const grouped: Record<string, ShoppingProductCart> = {};

      for (const row of raw) {
        const code = row.pro_code;

        if (!grouped[code]) {
          grouped[code] = {
            pro_code: row.pro_code,
            pro_name: row.pro_name,
            pro_imgmain: row.pro_imgmain,
            pro_priceA: row.pro_priceA,
            pro_priceB: row.pro_priceB,
            pro_priceC: row.pro_priceC,
            pro_unit1: row.pro_unit1,
            pro_unit2: row.pro_unit2,
            pro_unit3: row.pro_unit3,
            pro_ratio1: row.pro_ratio1,
            pro_ratio2: row.pro_ratio2,
            pro_ratio3: row.pro_ratio3,
            shopping_cart: [],
          };
        }

        grouped[code].shopping_cart.push({
          spc_id: row.spc_id,
          spc_amount: row.spc_amount,
          spc_checked: row.spc_checked,
          spc_unit: row.spc_unit,
        });
      }

      return Object.values(grouped);
    } catch (error) {
      console.error('Error get product cart:', error);
      throw new Error(`Error in Get product Cart`);
    }
  }
  // }
  // export class ShoppingCartService {

  // constructor(
  //     @InjectRepository(ShoppingCartEntity)
  //     private readonly shoppingCartRepo: Repository<ShoppingCartEntity>,
  //     @InjectRepository(UserEntity) // 👈 ใส่แบบนี้
  //     private readonly userRepo: Repository<UserEntity>,
  //     @InjectRepository(ProductEntity)
  //     private readonly productRepo: Repository<ProductEntity>,
  // ) { }

  async createShoppingCart(dto: CreateShoppingCartDto): Promise<ShoppingCartEntity> {
    const { mem_code, pro_code, ...rest } = dto;

    // ดึง User จาก mem_code
    const member = await this.userRepo.findOne({
      where: { mem_code },
    });
    if (!member) throw new Error('Member not found');

    // ดึง Product จาก pro_id
    const product = await this.productRepo.findOne({
      where: { pro_code },
    });
    if (!product) throw new Error('Product not found');

    // สร้าง cart entity
    const cart = this.shoppingCartRepo.create({
      ...rest,
      member,   // ใส่ relation ไปทั้ง object
      product,
    });

    return this.shoppingCartRepo.save(cart);
  }

  async updateCart(data: ShoppingCartEntity) {
    try {
      return await this.shoppingCartRepo.update(
        { spc_id: data.spc_id },
        data
      );
    } catch (error) {
      throw new Error('Error Update ProductCart');
    }
  }


  // async updateCart(id: number, dto: UpdateCartDto): Promise<{ updated: number }> {
  //     if (dto.select_all && dto.mem_id) {
  //         // ✅ กรณีเลือกทั้งหมดของสมาชิกคนเดียว
  //         const result = await this.shoppingCartRepo
  //             .createQueryBuilder()
  //             .update(ShoppingCartEntity)
  //             .set({ spc_check: dto.spc_check })
  //             .where('member.mem_id = :mem_id', { mem_id: dto.mem_id })
  //             .execute();

  //         return { updated: result.affected || 0 };
  //     }

  //     // ✅ อัปเดตเฉพาะสินค้า id เดียว
  //     const cartItem = await this.shoppingCartRepo.findOne({
  //         where: { spc_id: id },
  //         relations: ['member'],
  //     });

  //     if (!cartItem) {
  //         throw new Error('Cart item not found');
  //     }

  //     if (dto.spc_check !== undefined) {
  //         cartItem.spc_check = dto.spc_check;
  //     }

  //     if (dto.spc_amount !== undefined) {
  //         cartItem.spc_amount = dto.spc_amount;
  //     }

  //     await this.shoppingCartRepo.save(cartItem);
  //     return { updated: 1 };
  // }


  async deleteCart(dto: ShoppingCartEntity): Promise<{ deleted: number }> {
    const { member, spc_id } = dto;

    const where = spc_id
      ? { spc_id, user: { member } }
      : { user: { member } };

    const result = await this.shoppingCartRepo.delete(where);
    return { deleted: result.affected || 0 };
  }

  async getCartByMember(mem_code: string): Promise<ShoppingCartEntity[]> {
    return this.shoppingCartRepo
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.product', 'product')
      .leftJoinAndSelect('cart.member', 'member')
      .where('member.mem_code = :mem_code', { mem_code })
      .getMany();
  }

  // async getProductCart(mem_code: string): Promise<ProductCartDto[]> {
  //   const cartItems = await this.shoppingCartRepo
  //     .createQueryBuilder('cart')
  //     .leftJoinAndSelect('cart.product', 'product')
  //     .leftJoinAndSelect('cart.member', 'member')
  //     .where('member.mem_code = :mem_code', { mem_code })
  //     .getMany();

  //   return cartItems.map(item => ({
  //     mem_code: item.member.mem_code,
  //     cart: {
  //       spc_amount: item.spc_amount,
  //       spc_check: item.spc_check,
  //     },
  //     products: {
  //       pro_code: item.product.pro_code,
  //       pro_name: item.product.pro_name,
  //       pro_imagemain: item.product.pro_imgmain,
  //       pro_priceA: item.product.pro_priceA,
  //       pro_priceB: item.product.pro_priceB,
  //       pro_priceC: item.product.pro_priceC,
  //       pro_unit1: item.product['pro_unit1'],
  //       pro_ratio1: item.product['pro_ratio1'],
  //       pro_unit2: item.product['pro_unit2'],
  //       pro_ratio2: item.product['pro_ratio2'],
  //       pro_unit3: item.product['pro_unit3'],
  //       pro_ratio3: item.product['pro_ratio3'],
  //     }
  //   }));
  // }
}
