import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ItemService } from "./item.service";
import ItemCreateInput from "./dto/item-create-input.dto";
import ItemUpdateInput from "./dto/item-update-input.dto";

@Controller("item")
export class ItemController {
  constructor(private itemSevice: ItemService) {}

  @Get()
  async get(@Query("sort") sort?: "ASC" | "DESC") {
    return await this.itemSevice.getItems(sort);
  }

  @Post()
  async create(@Body() item: ItemCreateInput) {
    return await this.itemSevice.createItems(item);
  }

  @Put()
  async update(@Body() items: ItemUpdateInput[]) {
    return await this.itemSevice.updateItems(items);
  }

  @Get("topSale")
  async topSale() {
    return await this.itemSevice.getTopSale();
  }

  @Get(":id")
  async getByID(@Param() { id }: { id: string }) {
    return await this.itemSevice.getItem(id);
  }
}
