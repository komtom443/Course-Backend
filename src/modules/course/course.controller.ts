import { Body, Controller, Post, Put, Query } from "@nestjs/common";
import CourseService from "./course.service";
import CourseCreateInput from "./dto/course-create-input.dto";

@Controller("course")
export default class CourseController {
  constructor(private courseService: CourseService) {}

  @Post("getCourses")
  async getCoursesAdmin(@Body() { token }: { token: string }) {
    return await this.courseService.getCoursesAdmin(token);
  }

  @Post("createCourse")
  async createCourseAdmin(@Body() course: any) {
    return await this.courseService.createCourse(course);
  }

  @Post("updateCourseAdmin")
  async updateCourseAdmin(@Body() course: any) {
    console.log(course);

    return await this.courseService.updateCourseAdmin(course);
  }

  @Post("getCourseAdmin")
  async getCourseAdmin(@Body() { token, id }: { token: string; id: string }) {
    return await this.courseService.getCourseAdmin(token, id);
  }

  @Post("getUsersInCourseAdmin")
  async getUsersInCourseAdmin(@Body() { token, courseId }: { token: string; courseId: string }) {
    return await this.courseService.getUsersInCourse(token, courseId);
  }

  @Post("getUserInCourseAdmin")
  async getUserInCourseAdmin(@Body() { token, courseId, userId }: { token: string; courseId: string; userId: string }) {
    return await this.courseService.getUserInCourse(token, courseId, userId);
  }

  @Post("addUserInCourse")
  async addUserInCourse(@Body() body: { token: string; course: { id: string; users: Array<{ id: string }> } }) {
    return await this.courseService.addUserInCourse(body);
  }

  @Post("getLessonsInCourse")
  async getLessonsInCourse(@Body() { token, courseId }: { token: string; courseId: string }) {
    return await this.courseService.getLessonsInCourse(token, courseId);
  }

  @Post("addLessonInCourse")
  async addLessonInCourse(@Body() { token, data }: { token: string; data: { id: string; lessons: Array<{ id: string }> } }) {
    return await this.courseService.addLessonInCourse({ token, data });
  }

  @Post("getLessonInCourseAdmin")
  async getLessonInCourseAdmin(@Body() { token, courseId, lessonId }: { token: string; courseId: string; lessonId: string }) {
    return await this.courseService.getLessonInCourseAdmin(token, courseId, lessonId);
  }

  @Post("getCoursesUser")
  async getCoursesUser(@Body() { token }: { token: string }) {
    return await this.courseService.getCoursesUser(token);
  }

  @Post("addUserInCourseUser")
  async addUserInCourseUser(@Body() { token, courseId }: { token: string; courseId: string }) {
    return await this.courseService.addUserInCourseUser(token, courseId);
  }

  @Post("getMyCoursesUser")
  async getMyCoursesUser(@Body() { token }: { token: string }) {
    return await this.courseService.getMyCoursesUser(token);
  }
}
