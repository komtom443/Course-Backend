import { InjectRepository } from "@nestjs/typeorm";
import Category from "src/entities/category.entity";
import { IsNull, Not, Repository } from "typeorm";
import TokenService from "../token/token.service";
import CategoryCreateInput from "./dto/category-create-input.dto";
import { v4 as idGen } from "uuid";

export default class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    private tokenService: TokenService,
  ) {}

  async getCategoriesAdmin(token: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return;
    }
    return await this.categoryRepo.find({
      where: { deletedAt: IsNull() },
    });
  }

  async createCategory({ token, category }: { token: string; category: { name: string } }) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: 403, message: "Lỗi xác thực tài khoản" };
    }
    try {
      const tmp = await this.categoryRepo.save({
        id: idGen(),
        ...category,
      });
      return tmp;
    } catch (e) {
      console.log(e);

      return { error: 500, message: "Tên bị trùng" };
    }
  }
}
