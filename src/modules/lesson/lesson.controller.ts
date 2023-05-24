import { Body, Controller, Post, Put, Query } from "@nestjs/common";
import LessonService from "./lesson.service";
import LessonCreateInput from "./dto/lesson-create-input.dto";
import { log } from "console";

@Controller("lesson")
export default class LessonController {
  constructor(private lessonService: LessonService) {}
  @Post("getLessonsAdmin")
  async getLessonsAdmin(@Body() { token }: { token: string }) {
    return await this.lessonService.getLessonsAdmin(token);
  }

  @Post("getLessonAdmin")
  async getLessonAdmin(@Body() { token, id }: { token: string; id: string }) {
    return await this.lessonService.getLessonAdmin(token, id);
  }

  @Post("createLesson")
  async createLesson(@Body() { token, lesson }: { token: string; lesson: { title: string; description?: string; goal?: string } }) {
    return await this.lessonService.createLesson(token, lesson);
  }

  @Post("addQuestion")
  async addQuestion(@Body() { token, id, question }: { token: string; id: string; question: Array<any> }) {
    console.log(question);

    return await this.lessonService.addQuestion(token, id, question);
  }

  @Post("getQuestionAdmin")
  async getQuestionAdmin(@Body() { token, id }: { token: string; id: string }) {
    return await this.lessonService.getQuestionAdmin(token, id);
  }
}
