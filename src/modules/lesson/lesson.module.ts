import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import LessonController from "./lesson.controller";
import LessonService from "./lesson.service";
import { UserModule } from "../users/user.module";
import Lesson from "src/entities/lesson.entity";
import TokenModule from "../token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), TokenModule],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export default class LessonModule {}
