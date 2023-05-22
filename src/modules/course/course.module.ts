import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import CourseController from "./course.controller";
import CourseService from "./course.service";
import Course from "src/entities/course.entity";
import TokenModule from "../token/token.module";
import CategoryModule from "../category/category.module";
import StudentCourse from "src/entities/student_course.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Course, StudentCourse]), TokenModule, CategoryModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export default class CourseModule {}
