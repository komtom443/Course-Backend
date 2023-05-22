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
}
