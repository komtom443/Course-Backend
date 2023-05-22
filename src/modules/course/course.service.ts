import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import TokenService from "../token/token.service";
import { v4 as idGen } from "uuid";
import CategoryService from "../category/category.service";
import Category from "src/entities/category.entity";
import Course from "src/entities/course.entity";
import StudentCourse from "src/entities/student_course.entity";

export default class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(StudentCourse)
    private studentCourse: Repository<StudentCourse>,
    private tokenService: TokenService,
    private categoryService: CategoryService,
  ) {}

  async getCoursesAdmin(token: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return;
    }
    return await this.courseRepo
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.categories", "category")
      .leftJoinAndSelect("course.teachers", "user")
      .where("course.deletedAt IS NULL")
      .orderBy("course.name")
      .getMany();
  }

  async getUsersInCourse(token: string, courseId: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return;
    }
    return await this.studentCourse
      .createQueryBuilder("student_course")
      .leftJoinAndSelect("student_course.course", "course")
      .leftJoinAndSelect("student_course.user", "user")
      .where("course.deletedAt IS NULL")
      .andWhere("user.deletedAt IS NULL")
      .andWhere("course.id = :id", { id: courseId })
      .orderBy("student_course.user")
      .getMany();
  }

  async getCourseAdmin(token: string, id: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return;
    }

    return await this.courseRepo
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.categories", "category")
      .leftJoinAndSelect("course.teachers", "user")
      .where("course.deletedAt IS NULL")
      .andWhere("course.id = :id", { id })
      .orderBy("course.name")
      .getOne();
  }

  async createCourse({ token, course }: { token: string; course: any }) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    const categories: Array<any> = [];
    for (let i in course.categories) {
      if (typeof course.categories[i] === "string") {
        const tmp: any = await this.categoryService.createCategory({ token, category: { name: course.categories[i] } });

        if (!tmp.error) {
          categories.push(tmp as Category);
        }
      } else {
        categories.push(course.categories[i] as Category);
      }
    }
    course.categories = categories as Array<Category>;
    // delete course.teachers;
    console.log(course);
    const tmp = await this.courseRepo.save({
      id: idGen(),
      ...course,
    });
    console.log(tmp);
  }

  async updateCourseAdmin({ token, course }: { token: string; course: any }) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    console.log(course);

    const categories: Array<any> = [];
    for (let i in course.categories) {
      if (typeof course.categories[i] === "string") {
        const tmp: any = await this.categoryService.createCategory({ token, category: { name: course.categories[i] } });

        if (!tmp.error) {
          categories.push(tmp as Category);
        }
      } else {
        categories.push(course.categories[i] as Category);
      }
    }
    course.categories = categories as Array<Category>;
    // delete course.teachers;
    console.log(course);
    const tmp = await this.courseRepo.save({
      ...course,
    });
    console.log(tmp);
  }
}
