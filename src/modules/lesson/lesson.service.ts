import { InjectRepository } from "@nestjs/typeorm";
import Lesson from "src/entities/lesson.entity";
import { IsNull, Not, Repository } from "typeorm";
import TokenService from "../token/token.service";
import LessonCreateInput from "./dto/lesson-create-input.dto";
import { v4 as idGen } from "uuid";
import Question from "src/entities/question.entity";

export default class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,

    @InjectRepository(Question)
    private questionRepo: Repository<Question>,

    private tokenService: TokenService,
  ) {}
  async getLessonsAdmin(token: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    const lessons: any = await this.lessonRepo.createQueryBuilder("lesson").leftJoinAndSelect("lesson.courses", "course").where("lesson.deletedAt IS NULL").getMany();
    return lessons;
  }

  async createLesson(token: string, lesson: { id?: string; title: string; description?: string; goal?: string }) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    return await this.lessonRepo.save({ ...(!lesson.id ? { id: idGen() } : {}), ...lesson });
  }

  async addQuestion(token: string, id: string, question: Array<any>) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    return await this.questionRepo.save(
      question.map((i: any) => {
        return { ...i, courseId: id, ...(!i.id && { id: idGen() }) };
      }),
    );
  }

  async getQuestionAdmin(token: string, id: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    const questions: any = await this.questionRepo.find({
      where: {
        courseId: id,
      },
    });
    return questions;
  }

  async getLessonAdmin(token: string, id: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    const questions: any = await this.lessonRepo.find({
      where: {
        id,
      },
    });
    return questions;
  }
}
