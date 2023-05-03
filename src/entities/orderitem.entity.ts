import { type } from "os";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

Entity();
export default class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemId: string;

  @Column({ type: "int" })
  price: number;

  @Column({ type: "int", default: 0 })
  normalNumber: number;

  @Column({ type: "int", default: 0 })
  mediumNumber: number;

  @Column({ type: "int", default: 0 })
  largeNumber: number;
}
