import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class UserOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  courseId: string;

  @Column({ default: 0, type: "int" })
  completeNumber: number;

  @Column({ default: true })
  isActive: boolean;
}
