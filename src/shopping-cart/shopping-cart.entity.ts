import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/users.entity';
import { ProductEntity } from 'src/products/products.entity';

@Entity({ name: 'shopping_cart' })
export class ShoppingCartEntity {
  @PrimaryGeneratedColumn()
  spc_id: number;

  @Column({ type: 'decimal', precision: 16, scale: 2 })
  spc_amount: number;

  @Column({ length: 120, nullable: true })
  spc_unit1: string;

  @Column({ type: 'enum', enum: ['1', '2', '3'], nullable: true })
  spc_unit2: '1' | '2' | '3';

  @Column({ type: 'datetime' })
  spc_datetime: Date;

  @Column({ type: 'text', nullable: true })
  spc_comments: string;

  @Column({ type: 'enum', enum: ['0', '1'], default: '0' }) // 0 = not selected , 1 = selected
  spc_check: '0' | '1';

  @ManyToOne(() => UserEntity, (member) => member.shoppingCartItems)
  @JoinColumn({ name: 'mem_code' }) // Using ID for relation
  member: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.inCarts)
  @JoinColumn({ name: 'pro_code' }) // Using ID for relation
  product: ProductEntity;
}
