import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { OrderMService } from "./order.service";
import OrderCreateInput from "./dto/order-create-input.dto";
import OrderUpdateInput from "./dto/order-update-input.dto";

@Controller("order")
export class OrderController {
  constructor(private orderSevice: OrderMService) {}

  @Get()
  async get(@Query("sort") sort?: "ASC" | "DESC") {
    return await this.orderSevice.getOrders(sort);
  }

  @Post()
  async create(@Body() order: OrderCreateInput) {
    return await this.orderSevice.createOrders(order);
  }

  @Put()
  async update(@Body() orders: OrderUpdateInput[]) {
    return await this.orderSevice.updateOrders(orders);
  }

  @Get("topSale")
  async topSale() {
    return await this.orderSevice.getTopSale();
  }

  @Get(":id")
  async getByID(@Param() { id }: { id: string }) {
    return await this.orderSevice.getOrder(id);
  }
}
