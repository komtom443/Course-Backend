import { InjectRepository } from "@nestjs/typeorm";
import Item from "src/entities/item.entity";
import { IsNull, Repository } from "typeorm";
import { ItemCreateInput } from "../dto/item-create-input.dto";
import { v4 as idGen } from "uuid";

export default class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepo: Repository<Item>,
  ) {}

  async getItem(sort?: "ASC" | "DESC") {
    return await this.itemRepo.find({
      where: { deletedAt: IsNull() },
      order: { id: sort ? sort : "ASC" },
    });
  }

  async createItem(item: ItemCreateInput) {
    return await this.itemRepo.save({
      id: idGen(),
      ...item,
    });
  }
}
