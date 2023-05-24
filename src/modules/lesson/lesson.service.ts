import { InjectRepository } from "@nestjs/typeorm";
import Lesson from "src/entities/lesson.entity";
import { IsNull, Not, Repository } from "typeorm";
import TokenService from "../token/token.service";
import LessonCreateInput from "./dto/lesson-create-input.dto";
import { v4 as idGen } from "uuid";

export default class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
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
}
