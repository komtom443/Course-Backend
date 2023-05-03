import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class Item {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  isBig: boolean;

  @Column({ default: false })
  isMedium: boolean;

  @Column({ default: false })
  isStock: boolean;

  @Column({ type: "int" })
  price: number;

  @Column({ nullable: true })
  categoryId: string;

  @Column({ default: 0, type: "int" })
  saleNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
