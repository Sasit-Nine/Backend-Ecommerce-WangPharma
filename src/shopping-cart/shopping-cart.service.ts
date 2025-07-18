import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCartEntity } from './shopping-cart.entity';
import { Repository } from 'typeorm';
// import { CreateShoppingCartDto } from './create-shopping-cart.dto';
import { MemberEntity } from 'src/members/members.entity';
import { ProductEntity } from 'src/products/products.entity';
import { UpdateCartDto } from './UpdateCartDto.dto';

@Injectable()
export class ShoppingCartService {

    constructor(
        @InjectRepository(ShoppingCartEntity)
        private readonly cartRepo: Repository<ShoppingCartEntity>,
        // @InjectRepository(MemberEntity)
        // private readonly memberRepo: Repository<MemberEntity>,
        // @InjectRepository(ProductEntity)
        // private readonly productRepo: Repository<ProductEntity>,
    ) { }

    async createShoppingCart(dto: ShoppingCartEntity): Promise<ShoppingCartEntity> {
        // const member = await this.memberRepo.findOne({ where: { mem_id: dto.mem_id } });
        // const product = await this.productRepo.findOne({ where: { pro_id: dto.pro_id } });

        const cart = this.cartRepo.create(dto);
        return this.cartRepo.save(cart);
    }

    async updateCart(id: number, dto: UpdateCartDto): Promise<{ updated: number }> {
        if (dto.select_all && dto.mem_id) {
            // ✅ กรณีเลือกทั้งหมดของสมาชิกคนเดียว
            const result = await this.cartRepo
                .createQueryBuilder()
                .update(ShoppingCartEntity)
                .set({ spc_check: dto.spc_check })
                .where('member.mem_id = :mem_id', { mem_id: dto.mem_id })
                .execute();

            return { updated: result.affected || 0 };
        }

        // ✅ อัปเดตเฉพาะสินค้า id เดียว
        const cartItem = await this.cartRepo.findOne({
            where: { spc_id: id },
            relations: ['member'],
        });

        if (!cartItem) {
            throw new Error('Cart item not found');
        }

        if (dto.spc_check !== undefined) {
            cartItem.spc_check = dto.spc_check;
        }

        if (dto.spc_amount !== undefined) {
            cartItem.spc_amount = dto.spc_amount;
        }

        await this.cartRepo.save(cartItem);
        return { updated: 1 };
    }


    async deleteCart(dto: ShoppingCartEntity): Promise<{ deleted: number }> {
        const { mem_id, spc_id } = dto;

        const where = spc_id
            ? { spc_id, member: { mem_id } }
            : { member: { mem_id } };

        const result = await this.cartRepo.delete(where);
        return { deleted: result.affected || 0 };
    }

    // shopping-cart.service.ts
    async getCartByMember(mem_id: string): Promise<ShoppingCartEntity[]> {
        return this.cartRepo
            .createQueryBuilder('cart')
            .leftJoinAndSelect('cart.product', 'product')
            .leftJoinAndSelect('cart.member', 'member')
            .where('member.mem_id = :mem_id', { mem_id })
            .getMany();
    }


}
