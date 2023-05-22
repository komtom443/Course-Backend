import { Column, Entity, ManyToMany, PrimaryColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";
import Course from "./course.entity";

@Entity()
export default class Category {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  amount: number;

  @ManyToMany(() => Course, (courses: Course) => courses.categories, {
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
