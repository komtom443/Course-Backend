import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderMService } from "./order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import OrderItem from "src/entities/orderitem.entity";
import UserOrder from "src/entities/userorder.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserOrder, OrderItem])],
  controllers: [OrderController],
  providers: [OrderMService],
  exports: [OrderMService],
})
export class OrderModule {}
