import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import TokenService from "../token/token.service";
import { v4 as idGen } from "uuid";
import CategoryService from "../category/category.service";
import Category from "src/entities/category.entity";
import Course from "src/entities/course.entity";
import StudentCourse from "src/entities/student_course.entity";
import { UserService } from "../users/user.service";
import User from "src/entities/user.entity";
import { log } from "console";

export default class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(StudentCourse)
    private studentCourseRepo: Repository<StudentCourse>,

    private userService: UserService,
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
    return await this.studentCourseRepo
      .createQueryBuilder("student_course")
      .leftJoinAndSelect("student_course.course", "course")
      .leftJoinAndSelect("student_course.user", "user")
      .where("course.deletedAt IS NULL")
      .andWhere("user.deletedAt IS NULL")
      .andWhere("course.id = :id", { id: courseId })
      .orderBy("student_course.user")
      .getMany();
  }

  async getUserInCourse(token: string, courseId: string, userId: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return;
    }
    return await this.studentCourseRepo
      .createQueryBuilder("student_course")
      .leftJoinAndSelect("student_course.course", "course")
      .leftJoinAndSelect("student_course.user", "user")
      .where("course.deletedAt IS NULL")
      .andWhere("user.deletedAt IS NULL")
      .andWhere("course.id = :courseId", { courseId })
      .andWhere("user.id = :userId", { userId })
      .getOne();
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

  async addUserInCourse({ token, course }: { token: string; course: { id: string; users: Array<{ id: string }> } }) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    await this.courseRepo.save({
      id: course.id,
      currentUserNumber: course.users.length,
    });
    await this.studentCourseRepo.createQueryBuilder("student_course").delete().where("courseId = :id", { id: course.id }).execute();

    return await this.studentCourseRepo
      .createQueryBuilder()
      .insert()
      .into(StudentCourse)
      .values(
        course.users.map(i => {
          return { id: idGen(), user: { id: i.id }, course: { id: course.id } };
        }),
      )
      .execute();
  }
  async getLessonsInCourse(token: string, courseId: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }

    return await this.courseRepo
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.lessons", "lesson")
      .where("course.deletedAt IS NULL")
      .andWhere("lesson.deletedAt IS NULL")
      .andWhere("course.id = :courseId", { courseId })
      .getMany();
  }

  async addLessonInCourse({ token, data }: { token: string; data: { id: string; lessons: Array<{ id: string }> } }) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    console.log(data);

    await this.courseRepo.save({
      id: data.id,
      lessonNumber: data.lessons.length,
    });
    return await this.courseRepo.save(data);
  }

  async getLessonInCourseAdmin(token: string, courseId: string, lessonId: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return;
    }
    console.log(courseId, lessonId);
    console.log(
      await this.courseRepo
        .createQueryBuilder("course")
        .leftJoinAndSelect("course.lessons", "lesson")
        .where("course.deletedAt IS NULL")
        .andWhere("lesson.deletedAt IS NULL")
        .andWhere("course.id = :courseId", { courseId })
        .andWhere("lesson.id = :lessonId", { lessonId })
        .getOne(),
    );

    return await this.courseRepo
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.lessons", "lesson")
      .where("course.deletedAt IS NULL")
      .andWhere("lesson.deletedAt IS NULL")
      .andWhere("course.id = :courseId", { courseId })
      .andWhere("lesson.id = :lessonId", { lessonId })
      .getOne();
  }

  async getCoursesUser(token: string) {
    if (!(await this.tokenService.validateToken(token))) {
      return;
    }
    return await this.courseRepo
      .createQueryBuilder("course")
      .select(["course.id", "course.name", "course.note", "course.currentUserNumber", "course.maxUserNumber"])
      .leftJoinAndSelect("course.categories", "category")
      .leftJoinAndSelect("course.teachers", "user")
      .where("course.deletedAt IS NULL")
      .orderBy("course.name")
      .getMany();
  }

  async addUserInCourseUser(token: string, courseId: string) {
    console.log(courseId);

    if (!(await this.tokenService.validateToken(token))) {
      return { error: "Lỗi xác thực tài khoản" };
    }

    const course: Course = await this.courseRepo.findOne({
      where: {
        id: courseId,
      },
    });
    // console.log(course);
    if (course.currentUserNumber === course.maxUserNumber) {
      return { error: "Khóa học đã đầy" };
    }
    const user: User = await this.tokenService.getUserByToken(token);

    await this.courseRepo.save({
      id: course.id,
      currentUserNumber: course.currentUserNumber + 1,
    });
    if ((await this.studentCourseRepo.createQueryBuilder("student_course").where("courseId = :id", { id: course.id }).andWhere("userId = :id", { id: user.id }).getCount()) >= 0) {
      return { error: "Bạn đã ở trong khóa học rồi" };
    }

    return await this.studentCourseRepo
      .createQueryBuilder()
      .insert()
      .into(StudentCourse)
      .values({ id: idGen(), user: { id: user.id }, course: { id: course.id } })
      .execute();
  }

  async getMyCoursesUser(token: string) {
    if (!(await this.tokenService.validateToken(token))) {
      return;
    }
    const user: User = await this.tokenService.getUserByToken(token);
    console.log(user.id);

    const tmp = (
      await this.studentCourseRepo
        .createQueryBuilder("student_course")
        .leftJoinAndSelect("student_course.course", "course")
        .leftJoinAndSelect("student_course.user", "user")
        .where("course.deletedAt IS NULL")
        .andWhere("user.deletedAt IS NULL")
        .andWhere("user.id = :userId", { userId: user.id })
        .getMany()
    ).map((i: any) => {
      return i.course.id;
    });
    console.log(tmp);

    //   return await this.courseRepo
    //     .createQueryBuilder("course")
    //     .select(["course.id", "course.name", "course.note", "course.currentUserNumber", "course.maxUserNumber"])
    //     .leftJoinAndSelect("course.categories", "category")
    //     .leftJoinAndSelect("course.students", "student_course")
    //     .leftJoinAndSelect("student_course.user", "user")
    //     .andWhere("user.deletedAt IS NULL")
    //     .andWhere("student_course.user.id = :userId", { userId: user.id })
    //     .leftJoinAndSelect("course.teachers", "userA")
    //     .where("course.deletedAt IS NULL")
    //     .orderBy("course.name")
    //     .getMany();
  }
}
