import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import Course from "./course.entity";

@Entity()
export default class Lesson {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ length: 10240 })
  note?: string;

  @ManyToMany(() => Course, (courses: Course) => courses.lessons, {
    nullable: true,
  })
  courses: Course[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
