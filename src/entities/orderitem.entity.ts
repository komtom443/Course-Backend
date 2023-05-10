import { type } from "os";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemId: string;

  @Column()
  orderId: string;

  @Column({ type: "int", default: 0 })
  price: number;

  @Column({ type: "int", default: 0 })
  sizeS: number;

  @Column({ type: "int", default: 0 })
  sizeM: number;

  @Column({ type: "int", default: 0 })
  sizeL: number;
}
