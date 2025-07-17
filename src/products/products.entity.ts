import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ProductPharmaEntity } from './product-pharma.entity';
import { ShoppingCartEntity } from 'src/shopping-cart/shopping-cart.entity';
import { ShoppingOrderEntity } from 'src/shopping-order/shopping-order.entity';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  pro_id: number;

  @Column({ unique: true, length: 20 })
  pro_code: string;

  @Column({ length: 255 })
  pro_name: string;

  @Column({ length: 255, nullable: true })
  pro_nameEN: string;

  @Column({ length: 255, nullable: true })
  pro_nameSale: string;

  @Column({ length: 255, nullable: true })
  pro_namePacking: string;

  @Column({ length: 255, nullable: true })
  pro_genericname: string;

  @Column({ type: 'decimal', precision: 16, scale: 2, default: 0 })
  pro_price: number;

  @Column({ type: 'decimal', precision: 16, scale: 2, default: 0 })
  pro_priceA: number;

  // ... (ใส่ pro_priceB, C, D, E ตามลำดับ)

  @Column({ type: 'decimal', precision: 16, scale: 2, default: 0 })
  pro_cost: number;

  @Column({ length: 30, nullable: true })
  pro_supplier: string;

  @Column({ length: 60, nullable: true })
  pro_barcode1: string;

  @Column({ length: 60, nullable: true })
  pro_barcode2: string;

  @Column({ length: 60, nullable: true })
  pro_barcode3: string;

  // ... (ใส่ barcode2-4)

  @Column({ type: 'enum', enum: ['Y', 'N'], default: 'N' })
  pro_isdrug: 'Y' | 'N';

  @Column({ type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  pro_isvat: 'Y' | 'N';

  @Column({ type: 'enum', enum: ['Y', 'N'], default: 'N' })
  pro_ishot: 'Y' | 'N';

  // ... (ใส่ ENUM ที่เหลือตามลำดับ)

  @Column({ length: 120, nullable: true })
  pro_drugregister: string;

  // ... (ใส่ฟิลด์อื่นๆ ที่เหลือ โดยกำหนด nullable: true หากไม่จำเป็น)

  @Column({ type: 'decimal', precision: 6, scale: 1, nullable: true })
  pro_utility: number;

  @OneToOne(() => ProductPharmaEntity, (pharma) => pharma.product)
  pharmaDetails: ProductPharmaEntity;

  @OneToMany(() => ShoppingCartEntity, (cart) => cart.product)
  inCarts: ShoppingCartEntity[];

  @OneToMany(() => ShoppingOrderEntity, (orderDetail) => orderDetail.product)
  inOrders: ShoppingOrderEntity[];
}
