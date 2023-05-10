import { type } from "os";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class UserOrder {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column({ type: "int", default: 0 })
  price: number;

  @Column({ default: "editing" })
  state: "complete" | "editing" | "shipping";

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
