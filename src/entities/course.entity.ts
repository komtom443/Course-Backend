import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Lesson from './lesson.entity';

@Entity()
export default class Course {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  note: string;

  @Column()
  courseType: 'standard' | 'premium' | 'admin';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Lesson, (lesson: Lesson) => lesson.courses, {
    nullable: true,
  })
  lessons: Promise<Lesson[]>;
}
