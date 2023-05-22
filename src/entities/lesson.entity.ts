import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import Course from "./course.entity";

@Entity()
export default class Lesson {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Course, (courses: Course) => courses.lessons, {
    nullable: true,
  })
  courses: Course[];
}
