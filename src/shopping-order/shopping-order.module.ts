import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingOrderEntity } from './shopping-order.entity';
import { ShoppingHeadService } from 'src/shopping-head/shopping-head.service';
import { ShoppingOrderService } from './shopping-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingOrderEntity])],
  providers: [ShoppingOrderService],
  exports: [ShoppingOrderService],
})
export class ShoppingOrderModule {}
