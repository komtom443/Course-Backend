import { type } from "os";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

Entity();
export default class UserOrder {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column({ type: "int" })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
