import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import CategoryController from "./category.controller";
import CategoryService from "./category.service";
import { UserModule } from "../users/user.module";
import Category from "src/entities/category.entity";
import TokenModule from "../token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([Category]), TokenModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export default class CategoryModule {}
