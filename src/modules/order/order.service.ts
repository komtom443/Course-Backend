import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import OrderCreateInput from "./dto/order-create-input.dto";
import { v4 as idGen } from "uuid";
import OrderUpdateInput from "./dto/order-update-input.dto";
import UserOrder from "src/entities/userorder.entity";
import OrderItem from "src/entities/orderitem.entity";
import OrderItemCreateInput from "./dto/order-item-create-input.dto";
import TokenService from "../token/token.service";
import User from "src/entities/user.entity";
import { async } from "rxjs";
import { ItemService } from "../item/item.service";

type getBasic = {};

export class OrderMService {
  constructor(
    @InjectRepository(UserOrder)
    private orderRepo: Repository<UserOrder>,

    @InjectRepository(OrderItem)
    private orderItem: Repository<OrderItem>,

    private tokenService: TokenService,

    private itemService: ItemService,
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

  async updateOrders(order: { token: string; id: string; items: OrderItem[] }) {
    console.log(order);
    let price = 0;
    order.items.forEach(element => {
      price += element.sizeS * element.price + element.sizeM * (element.price + 5000) + element.sizeL * (element.price + 5000);
    });
    await this.orderRepo.save({
      id: order.id,
      updatedAt: new Date(),
      price,
    });
    await this.orderItem.save(order.items);
    return "";
  }

  async getOrder(id: string) {
    return await this.orderRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async completeOrder(id: string) {
    if ((await this.orderItem.count({ where: { orderId: id } })) === 0) {
      return;
    }
    return await this.orderRepo.save({
      id,
      state: "shipping",
    });
  }

  async getTopSale() {
    return await this.orderRepo.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: "DESC" },
      take: 5,
    });
  }

  async addOrderItem({ userId, itemId, sizeS, sizeM, sizeL, price }: OrderItemCreateInput) {
    let haveOrder = false;
    const user: User = await this.tokenService.getUserByToken(userId);
    userId = user?.id;
    try {
      const tmp = await this.orderRepo.count({
        where: {
          userId,
          state: "editing",
        },
      });
      if (tmp === 1) {
        haveOrder = true;
      }
    } catch (error) {
      haveOrder = false;
    }
    let order: UserOrder = null;
    if (haveOrder) {
      order = await this.orderRepo.findOne({
        where: { userId, state: "editing" },
        order: { createdAt: "DESC" },
      });
    } else {
      order = await this.orderRepo.save({
        id: idGen(),
        userId,
      });
    }
    if (
      (await this.orderItem.count({
        where: { orderId: order.id, itemId },
      })) === 1
    ) {
      const tmp1 = await this.orderItem.findOne({
        where: { orderId: order.id, itemId },
      });
      await this.orderItem.save({
        ...(tmp1 ? { id: tmp1.id } : {}),
        itemId,
        price,
        ...(sizeS ? { sizeS: sizeS + tmp1.sizeS } : {}),
        ...(sizeM ? { sizeM: sizeM + tmp1.sizeM } : {}),
        ...(sizeL ? { sizeL: sizeL + tmp1.sizeL } : {}),
      });
    } else {
      await this.orderItem.save({
        orderId: order.id,
        itemId,
        price,
        ...(sizeS ? { sizeS: sizeS } : {}),
        ...(sizeM ? { sizeM: sizeM } : {}),
        ...(sizeL ? { sizeL: sizeL } : {}),
      });
    }
    order = await this.orderRepo.findOne({
      where: { id: order.id },
    });
    await this.orderRepo.save({
      ...order,
      price: order.price + (sizeS ? sizeS * price : 0) + (sizeM ? sizeM * (price + 5000) : 0) + (sizeL ? sizeL * (price + 15000) : 0),
    });
  }

  async getOrderHistory(token: string) {
    const user: User = await this.tokenService.getUserByToken(token);
    if (
      (await this.orderRepo.count({
        where: {
          ...(user.userType === "standard" ? { userId: user.id } : {}),
          state: Not("editing"),
        },
        order: { updatedAt: "DESC" },
      })) === 0
    ) {
      return;
    }

    const order = await this.orderRepo.find({
      where: {
        ...(user.userType === "standard" ? { userId: user.id } : {}),
        state: Not("editing"),
      },
      order: { updatedAt: "DESC" },
    });
    const resp: Array<any> = [];
    for (let i = 0; i < order.length; i++) {
      const tmp = await this.orderItem.find({ where: { orderId: order[i].id } });
      const items: Array<any> = [];
      for (let j = 0; j < tmp.length; j++) {
        if (tmp[j].sizeL + tmp[j].sizeM + tmp[j].sizeS === 0) {
          continue;
        }
        const item = await this.itemService.getItem(tmp[j].itemId);
        items.push({ ...tmp[j], item: item });
      }
      resp.push({ ...order[i], items: items });
    }
    console.log(resp);

    return resp;
  }

  async getCurrentOrder(token: string) {
    const user: User = await this.tokenService.getUserByToken(token);
    if (
      (await this.orderRepo.count({
        where: {
          userId: user.id,
          state: "editing",
        },
        order: { updatedAt: "DESC" },
      })) === 0
    ) {
      return await this.orderRepo.save({
        id: idGen(),
        userId: user.id,
      });
    }

    const order = await this.orderRepo.findOne({
      where: {
        userId: user.id,
        state: "editing",
      },
      order: { updatedAt: "DESC" },
    });
    const tmp = await this.orderItem.find({ where: { orderId: order.id } });
    const items: Array<any> = [];
    for (let j = 0; j < tmp.length; j++) {
      if (tmp[j].sizeL + tmp[j].sizeM + tmp[j].sizeS === 0) {
        continue;
      }
      const item = await this.itemService.getItem(tmp[j].itemId);
      items.push({ ...tmp[j], item: item });
    }
    return { ...order, items: items };
  }
  async updateState(items: Array<any>) {
    this.orderRepo.save(items);
  }
}
