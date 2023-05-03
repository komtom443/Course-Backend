import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import OrderCreateInput from "./dto/order-create-input.dto";
import { v4 as idGen } from "uuid";
import OrderUpdateInput from "./dto/order-update-input.dto";
import UserOrder from "src/entities/userorder.entity";
import OrderItem from "src/entities/orderitem.entity";

type getBasic = {};

export class OrderMService {
  constructor(
    @InjectRepository(UserOrder)
    private orderRepo: Repository<UserOrder>,

    @InjectRepository(OrderItem)
    private orderItem: Repository<OrderItem>,
  ) {}

  async getOrders(sort?: "ASC" | "DESC") {
    return await this.orderRepo.find({
      where: { deletedAt: IsNull() },
      order: { id: sort ? sort : "ASC" },
    });
  }

  async createOrders(order: OrderCreateInput) {
    var resp: any[] = [];

    resp.push({
      id: idGen(),
      ...order,
    });

    return this.orderRepo.save(resp);
  }

  async updateOrders(orders: OrderUpdateInput[]) {
    var resp: any[] = [];
    orders.forEach(order => {
      resp.push({
        ...order,
      });
    });
    return this.orderRepo.save(resp);
  }

  async getOrder(id: string) {
    return this.orderRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async getTopSale() {
    return this.orderRepo.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: "DESC" },
      take: 5,
    });
  }
}
