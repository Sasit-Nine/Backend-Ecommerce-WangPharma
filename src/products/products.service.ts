// src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './products.entity';
import { Repository } from 'typeorm';
// import { CreateProductDto } from './create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async createProduct(product: ProductEntity) {
    try {
      const newProduct = this.productRepo.create(product);
      await this.productRepo.save(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Error creating product');
    }
  }

  async updateProduct(product: ProductEntity) {
    try {
      await this.productRepo.update({ pro_code: product.pro_code }, product);
      console.log('Product Update Sucesss');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  async searchProducts(data: {
    keyword: string;
    offset: number;
  }): Promise<{ products: ProductEntity[]; totalCount: number }> {
    try {
      const qb = this.productRepo
        .createQueryBuilder('product')
        .where('product.pro_name LIKE :keyword', {
          keyword: `%${data.keyword}%`,
        })
        .orWhere('product.pro_keysearch LIKE :keyword', {
          keyword: `%${data.keyword}%`,
        });

      const totalCount = await qb.getCount();
      const products = await qb
        .take(30)
        .skip(data.offset)
        .select([
          'product.pro_id',
          'product.pro_code',
          'product.pro_name',
          'product.pro_priceA',
          'product.pro_priceB',
          'product.pro_priceC',
          'product.pro_imgmain',
        ])
        .getMany();
      return { products, totalCount };
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Error searching products');
    }
  }

  async listFree() {
    try {
      const data = await this.productRepo.find({
        where: {
          pro_free: true,
        },
        select: {
          pro_code: true,
          pro_name: true,
          pro_point: true,
          pro_imgmain: true,
        },
      });
      return data;
    } catch (error) {
      console.error('Error free products:', error);
      throw new Error('Error free products');
    }
  }
}
