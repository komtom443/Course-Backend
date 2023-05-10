import { InjectRepository } from "@nestjs/typeorm";
import Item from "src/entities/item.entity";
import { IsNull, Not, Repository } from "typeorm";
import ItemCreateInput from "./dto/item-create-input.dto";
import { v4 as idGen } from "uuid";
import ItemUpdateInput from "./dto/item-update-input.dto";
import Token from "src/entities/token.entity";
import * as bcrypt from "bcrypt";
import TokenCreateInput from "../token/dto/token-create-input.dto";

type getBasic = {};

export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepo: Repository<Item>,
  ) {}

  async getItems(sort?: "ASC" | "DESC") {
    return await this.itemRepo.find({
      where: { deletedAt: IsNull() },
      order: { id: sort ? sort : "ASC" },
    });
  }

  async createItems(item: ItemCreateInput) {
    var resp: any[] = [];

    resp.push({
      id: idGen(),
      ...item,
    });

    return this.itemRepo.save(resp);
  }

  async updateItems(items: ItemUpdateInput[]) {
    var resp: any[] = [];
    items.forEach(item => {
      resp.push({
        ...item,
      });
    });
    return this.itemRepo.save(resp);
  }

  async getItem(id: string) {
    return this.itemRepo.findOne({
      select: ["id", "name", "price", "isBig", "isMedium"],
      where: { id, deletedAt: IsNull() },
    });
  }

  async getTopSale() {
    return this.itemRepo.find({
      where: { deletedAt: IsNull() },
      order: { saleNumber: "DESC" },
      take: 3,
    });
  }
}
