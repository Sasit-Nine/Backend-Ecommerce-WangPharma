import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCartEntity } from './shopping-cart.entity';
import { Repository } from 'typeorm';
// import { CreateShoppingCartDto } from './create-shopping-cart.dto';
// import { MemberEntity } from 'src/members/members.entity';
import { ProductEntity } from 'src/products/products.entity';
// import { CreateProductDto } from 'src/products/create-product.dto';
import { CreateShoppingCartDto } from './create-shopping-cart.dto';
import { UserEntity } from 'src/users/users.entity';


@Injectable()
export class ShoppingCartService {

    constructor(
        @InjectRepository(ShoppingCartEntity)
        private readonly cartRepo: Repository<ShoppingCartEntity>,
        @InjectRepository(UserEntity) // 👈 ใส่แบบนี้
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
    ) { }

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
        const cart = this.cartRepo.create({
            ...rest,
            member,   // ใส่ relation ไปทั้ง object
            product,
        });

        return this.cartRepo.save(cart);
    }

    async updateCart(data: ShoppingCartEntity) {
      try {
        return await this.cartRepo.update(
          {spc_id: data.spc_id},
          data
        );
      } catch (error) {
        throw new Error('Error Update ProductCart');
      }
    }


    // async updateCart(id: number, dto: UpdateCartDto): Promise<{ updated: number }> {
    //     if (dto.select_all && dto.mem_id) {
    //         // ✅ กรณีเลือกทั้งหมดของสมาชิกคนเดียว
    //         const result = await this.cartRepo
    //             .createQueryBuilder()
    //             .update(ShoppingCartEntity)
    //             .set({ spc_check: dto.spc_check })
    //             .where('member.mem_id = :mem_id', { mem_id: dto.mem_id })
    //             .execute();

    //         return { updated: result.affected || 0 };
    //     }

    //     // ✅ อัปเดตเฉพาะสินค้า id เดียว
    //     const cartItem = await this.cartRepo.findOne({
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

    //     await this.cartRepo.save(cartItem);
    //     return { updated: 1 };
    // }


    async deleteCart(dto: ShoppingCartEntity): Promise<{ deleted: number }> {
        const { member, spc_id } = dto;

        const where = spc_id
            ? { spc_id, user: { member } }
            : { user: { member } };

        const result = await this.cartRepo.delete(where);
        return { deleted: result.affected || 0 };
    }

    async getCartByMember(mem_code: string): Promise<ShoppingCartEntity[]> {
        return this.cartRepo
            .createQueryBuilder('cart')
            .leftJoinAndSelect('cart.product', 'product')
            .leftJoinAndSelect('cart.member', 'member')
            .where('member.mem_code = :mem_code', { mem_code })
            .getMany();
    }

    async getProductCart(mem_code: string): Promise<ShoppingCartEntity[]> {
        const data = await this.cartRepo.find({
            where: {
                member: { mem_code: mem_code }
            },
            select: {
                spc_amount: true,
                spc_check: true,
                product: {
                    pro_code: true,
                    pro_name: true,
                    pro_imgmain: true,
                    pro_priceA: true,
                    pro_priceB: true,
                    pro_priceC: true,
                    pro_un
                }
            }
        })
        // const cartItems = await this.cartRepo
        //     .createQueryBuilder('cart')
        //     .leftJoinAndSelect('cart.product', 'product')
        //     .leftJoinAndSelect('cart.member', 'member')
        //     .where('member.mem_code = :mem_code', { mem_code })
        //     .getMany();

        // return cartItems.map(item => ({
        //     mem_code: item.member.mem_code,
        //     cart: {
        //         spc_amount: item.spc_amount,
        //         spc_check: item.spc_check,
        //     },
        //     products: {
        //         pro_code: item.product.pro_code,
        //         pro_name: item.product.pro_name,
        //         pro_imagemain: item.product.pro_imgmain,
        //         pro_priceA: item.product.pro_priceA,
        //         pro_priceB: item.product.pro_priceB,
        //         pro_priceC: item.product.pro_priceC,
        //         pro_unit1: item.product['pro_unit1'],
        //         pro_ratio1: item.product['pro_ratio1'],
        //         pro_unit2: item.product['pro_unit2'],
        //         pro_ratio2: item.product['pro_ratio2'],
        //         pro_unit3: item.product['pro_unit3'],
        //         pro_ratio3: item.product['pro_ratio3'],
        //     }
        // }));
    }
}
