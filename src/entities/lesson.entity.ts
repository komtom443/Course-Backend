import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import Course from "./course.entity";

@Entity()
export default class Lesson {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ length: 1024, nullable: true })
  goal?: string;
  @Column({ length: 1024, nullable: true })
  description?: string;

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
