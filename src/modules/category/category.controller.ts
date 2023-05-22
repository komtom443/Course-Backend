import { Body, Controller, Post, Put, Query } from "@nestjs/common";
import CategoryService from "./category.service";
import CategoryCreateInput from "./dto/category-create-input.dto";

@Controller("category")
export default class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post("getCategories")
  async getCategoriesAdmin(@Body() { token }: { token: string }) {
    return await this.categoryService.getCategoriesAdmin(token);
  }

  @Post("createCategory")
  async createCategoryAdmin(@Body() category: any) {
    return await this.categoryService.createCategory(category);
  }
}
