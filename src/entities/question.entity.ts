import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Question {
  @PrimaryColumn()
  id: string;

  @Column()
  courseId: string;

  @Column()
  questionType: "checkbox" | "box";

  @Column()
  question: string;

  @Column({ nullable: true })
  optionA?: string;

  @Column({ nullable: true })
  optionB?: string;

  @Column({ nullable: true })
  optionC?: string;

  @Column({ nullable: true })
  optionD?: string;

  @Column({ nullable: true })
  answer?: string;
}
