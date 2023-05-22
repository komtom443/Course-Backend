import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import Lesson from "./lesson.entity";
import Category from "./category.entity";
import User from "./user.entity";
import StudentCourse from "./student_course.entity";

@Entity()
export default class Course {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, length: 1024 })
  note: string;

  @Column({ default: 0, type: "int" })
  lessonNumber: number;

  @Column({ default: 0, type: "int" })
  currentUserNumber: number;

  @Column({ default: 0, type: "int" })
  maxUserNumber: number;

  @ManyToMany(() => Category, (category: Category) => category.courses, { nullable: true })
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Lesson, (lesson: Lesson) => lesson.courses, {
    nullable: true,
  })
  @JoinTable()
  lessons: Lesson[];

  @ManyToMany(() => User, (user: User) => user.coursesTaught, {
    nullable: true,
  })
  @JoinTable()
  teachers: User[];

  @OneToMany(() => StudentCourse, studentCourse => studentCourse.course, { nullable: true })
  students?: StudentCourse[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
