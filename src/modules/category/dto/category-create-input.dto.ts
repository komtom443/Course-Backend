import { IsNotEmpty } from "class-validator";
import Category from "src/entities/category.entity";
import Lesson from "src/entities/lesson.entity";

export default class CategoryCreateInput {
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  teacherId?: string;

  isRemember: boolean;

  note?: string;

  lessons?: Lesson[];

  categories?: Category[];
}
