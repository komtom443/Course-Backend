import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Course from "./course.entity";
import User from "./user.entity";

@Entity()
export default class StudentCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, student => student.courses, { nullable: true })
  @JoinColumn()
  user?: User;

  @ManyToOne(() => Course, course => course.students, { nullable: true })
  @JoinColumn()
  course?: Course;

  @Column({ type: "int", default: 0 })
  progress: number;

  @Column({ default: "0 0 0 " })
  score: string;
}
