import { IsNotEmpty } from "class-validator";
import Lesson from "src/entities/lesson.entity";

export default class LessonCreateInput {
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  teacherId?: string;

  isRemember: boolean;

  note?: string;

  lessons?: Lesson[];

  categories?: Lesson[];
}
