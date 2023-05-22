import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm";
import Course from "./course.entity";
import StudentCourse from "./student_course.entity";

@Entity()
export default class User {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: "integer" })
  age: number;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ length: 60 })
  passwd: string;

  @Column({})
  avatarUrl: string;

  @Column({ default: "standard" })
  userType: "standard" | "teacher" | "admin";

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Course, (course: Course) => course.teachers, {
    nullable: true,
  })
  coursesTaught: Course[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => StudentCourse, studentCourse => studentCourse.user, { nullable: true })
  courses?: StudentCourse[];
}
