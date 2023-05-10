import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { OrderMService } from "./order.service";
import OrderCreateInput from "./dto/order-create-input.dto";
import OrderUpdateInput from "./dto/order-update-input.dto";
import OrderItemCreateInput from "./dto/order-item-create-input.dto";
import { log } from "console";
import OrderItem from "src/entities/orderitem.entity";

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
  async update(@Body() order: { token: string; id: string; items: OrderItem[] }) {
    log("Update");
    return await this.orderSevice.updateOrders(order);
  }

  @Get("topSale")
  async topSale() {
    return await this.orderSevice.getTopSale();
  }

  @Post("add_item")
  async addItem(@Body() orderItem: OrderItemCreateInput) {
    return await this.orderSevice.addOrderItem(orderItem);
  }

  @Post("history")
  async getOrderHistory(@Body() { token }: { token: string }) {
    return await this.orderSevice.getOrderHistory(token);
  }

  @Post("current")
  async getCurrentOrder(@Body() { token }: { token: string }) {
    return await this.orderSevice.getCurrentOrder(token);
  }

  @Post("complete")
  async completeOrder(@Body() { id }: { id: string; token: string }) {
    return await this.orderSevice.completeOrder(id);
  }

  @Post("updateState")
  async updateState(@Body() { items }: { items: Array<any> }) {
    return await this.orderSevice.updateState(items);
  }

  @Get(":id")
  async getByID(@Param() { id }: { id: string }) {
    return await this.orderSevice.getOrder(id);
  }
}
