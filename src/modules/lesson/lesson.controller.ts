import { Body, Controller, Post, Put, Query } from "@nestjs/common";
import LessonService from "./lesson.service";
import LessonCreateInput from "./dto/lesson-create-input.dto";

@Controller("lesson")
export default class LessonController {
  constructor(private lessonService: LessonService) {}
  @Post("getLessonsAdmin")
  async getLessonsAdmin(@Body() { token }: { token: string }) {
    return await this.lessonService.getLessonsAdmin(token);
  }
}
